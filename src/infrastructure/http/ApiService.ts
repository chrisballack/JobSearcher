import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiError, NetworkError } from "@/core/errors";

// ============================================================================
// Constants
// ============================================================================
const DEFAULT_TIMEOUT = 10000;

// ============================================================================
// Types
// ============================================================================
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: unknown;
  timestamp?: string;
  statusCode?: number;
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

// ============================================================================
// Helpers
// ============================================================================
export const extractApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const backendMessage = (error.response?.data as ApiErrorResponse)?.message;
    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }
    if (error.response) {
      return `Error ${error.response.status}: ${error.message}`;
    }
    if (error.request) {
      return "Sin respuesta del servidor. Verifica tu conexión.";
    }
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado";
};

const transformAxiosError = (error: unknown): NetworkError | ApiError => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 0;
    const backendData = error.response?.data as ApiErrorResponse | undefined;
    const message =
      backendData?.message ||
      error.message ||
      "Error de conexión con el servidor";

    if (statusCode >= 400) {
      return new ApiError(message, statusCode, backendData);
    }
    return new NetworkError(message, statusCode, backendData);
  }
  if (error instanceof NetworkError) return error;
  return new NetworkError(
    error instanceof Error ? error.message : "Error desconocido",
    0,
    error,
  );
};

const buildQueryString = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// ============================================================================
// ApiService
// ============================================================================
export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: DEFAULT_TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  // ==========================================================================
  // Configuring Interceptors
  // ==========================================================================
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (__DEV__) {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          );
        }
        return config;
      },
      (error: AxiosError) => {
        const transformedError = transformAxiosError(error);
        if (__DEV__) {
          console.error("[API Request Error]", transformedError.message);
        }
        return Promise.reject(transformedError);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log(
            `[API Response] ${response.status} ${response.config.url}`,
          );
        }
        return response;
      },
      (error: AxiosError) => {
        const transformedError = transformAxiosError(error);

        if (__DEV__) {
          console.error(
            "[API Error]",
            transformedError instanceof Error
              ? transformedError.message
              : transformedError,
          );
        }

        return Promise.reject(transformedError);
      },
    );
  }

  // ==========================================================================
  // Métodos HTTP
  // ==========================================================================
  async get<T>(
    url: string,
    params?: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const queryString = params ? buildQueryString(params) : "";
      const response = await this.axiosInstance.get<T>(
        `${url}${queryString}`,
        config,
      );
      return response.data;
    } catch (error) {
      throw transformAxiosError(error);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      if (__DEV__) {
        console.log("[API POST Response]", response.data);
      }
      return response.data;
    } catch (error) {
      throw transformAxiosError(error);
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw transformAxiosError(error);
    }
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw transformAxiosError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw transformAxiosError(error);
    }
  }

  // ==========================================================================
  // Helpers
  // ==========================================================================
  buildUrl(url: string, params?: QueryParams): string {
    const queryString = params ? buildQueryString(params) : "";
    return `${url}${queryString}`;
  }
}
