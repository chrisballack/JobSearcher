import { IFavoriteRepository } from "@/domain/repositories/FavoriteRepository";
import { CacheStorage } from "@/infrastructure/storage/CacheStorage";
import { JobCardProps } from "@/presentation/components/JobCard";
import Config from "@/core/constants/Config";

export class FavoriteRepositoryImpl implements IFavoriteRepository {
  private readonly CACHE_KEY = `${Config.CACHE.PREFIXES.FAVORITES}ALL`;

  constructor(private cacheStorage: CacheStorage) {}

  async getFavorites(): Promise<JobCardProps[]> {
    const cached = await this.cacheStorage.get<JobCardProps[]>(this.CACHE_KEY);

    if (!cached) {
      return [];
    }

    return cached;
  }

  async toggleFavorite(job: JobCardProps): Promise<JobCardProps[]> {
    const favorites = await this.getFavorites();
    const jobIndex = favorites.findIndex((f: JobCardProps) => f.id === job.id);

    if (jobIndex >= 0) {
      favorites.splice(jobIndex, 1);
    } else {
      favorites.push({ ...job, isFavorite: true });
    }

    await this.cacheStorage.set(
      this.CACHE_KEY,
      favorites,
      Config.CACHE.TTL.FOREVER,
    );

    if (Config.IS_DEV) {
      console.log(
        `[FavoriteRepository] Toggled job ${job.id} — ${favorites.length} total favorites`,
      );
    }

    return favorites;
  }

  async isFavorite(jobId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some((f: JobCardProps) => f.id === jobId);
  }

  async clearFavorites(): Promise<void> {
    await this.cacheStorage.clear(this.CACHE_KEY);
  }
}
