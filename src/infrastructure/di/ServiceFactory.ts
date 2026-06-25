import { Config } from "@/core/constants/Config";
import { ApiService } from "@/infrastructure/http/ApiService";
import { CacheStorage } from "@/infrastructure/storage/CacheStorage";
import { ICategoryRepository } from "@/domain/repositories/CategoryRepository";
import { CategoryRepositoryImpl } from "@/data/repositories/CategoryRepositoryImpl";
import { CategoryRemoteDataSourceImpl } from "@/data/datasources/remote/CategoryRemoteDataSource";
import { GetCategoriesUseCase } from "@/domain/usecases/GetCategoriesUseCase";
import { IJobRepository } from "@/domain/repositories/JobRepository";
import { JobRepositoryImpl } from "@/data/repositories/JobRepositoryImpl";
import { JobRemoteDataSourceImpl } from "@/data/datasources/remote/JobRemoteDataSource";
import { GetJobsUseCase } from "@/domain/usecases/GetJobsUseCase";
import { IFavoriteRepository } from "@/domain/repositories/FavoriteRepository";
import { FavoriteRepositoryImpl } from "@/data/repositories/FavoriteRepositoryImpl";
import { GetFavoritesUseCase } from "@/domain/usecases/GetFavoritesUseCase";
import { ToggleFavoriteUseCase } from "@/domain/usecases/ToggleFavoriteUseCase";

export class ServiceFactory {
  private static instance: ServiceFactory;

  private apiService!: ApiService;
  private cacheStorage!: CacheStorage;

  // Repositories
  private categoryRepository!: ICategoryRepository;
  private jobRepository!: IJobRepository;
  private favoriteRepository!: IFavoriteRepository;

  // Use Cases
  private getCategoriesUseCase!: GetCategoriesUseCase;
  private getJobsUseCase!: GetJobsUseCase;
  private getFavoritesUseCase!: GetFavoritesUseCase;
  private toggleFavoriteUseCase!: ToggleFavoriteUseCase;

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

    // ------------------------
    // DATA SOURCES
    // ------------------------
    const categoryRemoteDataSource = new CategoryRemoteDataSourceImpl(
      this.apiService,
    );
    const jobRemoteDataSource = new JobRemoteDataSourceImpl(this.apiService);

    // ------------------------
    // REPOSITORIES
    // ------------------------
    this.categoryRepository = new CategoryRepositoryImpl(
      categoryRemoteDataSource,
      this.cacheStorage,
    );
    this.jobRepository = new JobRepositoryImpl(
      jobRemoteDataSource,
      this.cacheStorage,
    );
    this.favoriteRepository = new FavoriteRepositoryImpl(this.cacheStorage);

    // ------------------------
    // USE CASES
    // ------------------------
    this.getCategoriesUseCase = new GetCategoriesUseCase(
      this.categoryRepository,
    );
    this.getJobsUseCase = new GetJobsUseCase(this.jobRepository);
    this.getFavoritesUseCase = new GetFavoritesUseCase(this.favoriteRepository);
    this.toggleFavoriteUseCase = new ToggleFavoriteUseCase(
      this.favoriteRepository,
    );
  }

  // ==========================================================================
  // GETTERS - CORE
  // ==========================================================================
  getApiService(): ApiService {
    return this.apiService;
  }

  getCacheStorage(): CacheStorage {
    return this.cacheStorage;
  }

  // ==========================================================================
  // GETTERS - USE CASES
  // ==========================================================================
  getGetCategoriesUseCase(): GetCategoriesUseCase {
    return this.getCategoriesUseCase;
  }

  getGetJobsUseCase(): GetJobsUseCase {
    return this.getJobsUseCase;
  }

  getGetFavoritesUseCase(): GetFavoritesUseCase {
    return this.getFavoritesUseCase;
  }

  getToggleFavoriteUseCase(): ToggleFavoriteUseCase {
    return this.toggleFavoriteUseCase;
  }
}
