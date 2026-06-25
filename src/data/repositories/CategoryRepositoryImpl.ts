import { Category } from "@/domain/entities/Category";
import { ICategoryRepository } from "@/domain/repositories/CategoryRepository";
import { CategoryMapper, CategoriesApiResponse } from "@/data/dto/CategoryDto";
import { CategoryRemoteDataSource } from "@/data/datasources/remote/CategoryRemoteDataSource";
import { CacheStorage } from "@/infrastructure/storage/CacheStorage";
import Config from "@/core/constants/Config";

export class CategoryRepositoryImpl implements ICategoryRepository {
  private readonly CACHE_KEY = `${Config.CACHE.PREFIXES.CATEGORIES}ALL`;

  constructor(
    private remoteDataSource: CategoryRemoteDataSource,
    private cacheStorage: CacheStorage,
  ) {}

  async getCategories(): Promise<Category[]> {
    const cached = await this.cacheStorage.get<Category[]>(this.CACHE_KEY);

    if (cached) {
      if (Config.IS_DEV) {
        console.log(
          `[Cache] Categories loaded from cache — ${cached.length} items`,
        );
      }
      return cached;
    }

    try {
      const response: CategoriesApiResponse =
        await this.remoteDataSource.getCategories();

      if (!response.jobs || !Array.isArray(response.jobs)) {
        throw new Error(
          "Invalid categories response: missing or malformed jobs array",
        );
      }

      const categories = CategoryMapper.toDomainList(response.jobs);

      await this.cacheStorage.set(
        this.CACHE_KEY,
        categories,
        Config.CACHE.TTL.STATIC,
      );

      if (Config.IS_DEV) {
        console.log(
          `[API Response] Categories fetched — ${categories.length} items`,
        );
      }

      return categories;
    } catch (error) {
      if (Config.IS_DEV) {
        console.error(
          `[CategoryRepositoryImpl] Failed to fetch categories:`,
          error,
        );
      }
      throw error;
    }
  }
}
