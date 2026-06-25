import { Job, GetJobsParams } from "@/domain/entities/Job";
import { IJobRepository } from "@/domain/repositories/JobRepository";
import { JobMapper, JobsApiResponse } from "@/data/dto/JobDto";
import { JobRemoteDataSource } from "@/data/datasources/remote/JobRemoteDataSource";
import { CacheStorage } from "@/infrastructure/storage/CacheStorage";
import Config from "@/core/constants/Config";

export class JobRepositoryImpl implements IJobRepository {
  constructor(
    private remoteDataSource: JobRemoteDataSource,
    private cacheStorage: CacheStorage,
  ) {}

  private buildCacheKey(params: GetJobsParams): string {
    const search = params.search || "all";
    const category = params.categoryId || "all";
    const jobType = params.jobType || "all";
    const limit = params.limit || Config.PAGINATION.DEFAULT_LIMIT;
    return `${Config.CACHE.PREFIXES.JOBS_LIST}${search}_${category}_${jobType}_${limit}`;
  }

  async getJobs(params: GetJobsParams): Promise<Job[]> {
    const cacheKey = this.buildCacheKey(params);
    const cached = await this.cacheStorage.get<Job[]>(cacheKey);

    if (cached) {
      if (Config.IS_DEV) {
        console.log(`[Cache] Jobs loaded from cache — ${cached.length} items`);
      }
      return cached;
    }

    try {
      const response: JobsApiResponse =
        await this.remoteDataSource.getJobs(params);

      if (!response.jobs || !Array.isArray(response.jobs)) {
        throw new Error(
          "Invalid jobs response: missing or malformed jobs array",
        );
      }

      const jobs = JobMapper.toDomainList(response.jobs);
      await this.cacheStorage.set(cacheKey, jobs, Config.CACHE.TTL.DYNAMIC);

      if (Config.IS_DEV) {
        console.log(`[API Response] Jobs fetched — ${jobs.length} items`);
      }

      return jobs;
    } catch (error) {
      if (Config.IS_DEV) {
        console.error(`[JobRepositoryImpl] Failed to fetch jobs:`, error);
      }
      throw error;
    }
  }

  async invalidateCache(params?: GetJobsParams): Promise<void> {
    if (params) {
      const cacheKey = this.buildCacheKey(params);
      await this.cacheStorage.clear(cacheKey);
      if (Config.IS_DEV) {
        console.log(`[Cache] Invalidated cache for key: ${cacheKey}`);
      }
    } else {
      await this.cacheStorage.clearByPrefix(Config.CACHE.PREFIXES.JOBS_LIST);
      if (Config.IS_DEV) {
        console.log(`[Cache] Invalidated all jobs cache`);
      }
    }
  }
}
