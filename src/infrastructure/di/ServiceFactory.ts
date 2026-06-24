import { Config } from "@/core/constants/Config";
import { ApiService } from "@/infrastructure/http/ApiService";
import { CacheStorage } from "@/infrastructure/storage/CacheStorage";

export class ServiceFactory {
  private static instance: ServiceFactory;

  private apiService!: ApiService;
  private cacheStorage!: CacheStorage;

  private constructor() {
    this.setupServices();
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  private setupServices(): void {
    // ------------------------
    // CORE
    // ------------------------
    this.apiService = new ApiService(Config.API_BASE_URL);
    this.cacheStorage = CacheStorage.getInstance();
  }

  // ==========================================================================
  // GETTERS
  // ==========================================================================
  getApiService(): ApiService {
    return this.apiService;
  }

  getCacheStorage(): CacheStorage {
    return this.cacheStorage;
  }
}
