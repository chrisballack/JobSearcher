export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }
}
