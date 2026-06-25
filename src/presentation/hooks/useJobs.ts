import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { ServiceFactory } from "@/infrastructure/di/ServiceFactory";
import { Job, GetJobsParams } from "@/domain/entities/Job";
import { parseSalary, formatPostedDate } from "@/core/utils/formatters";
import Config from "@/core/constants/Config";

// ============================================================================
// UI Model
// ============================================================================
export interface JobCardData {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  postedAt: string;
  tags: string[];
  isFavorite: boolean;
}

export interface UseJobsReturn {
  jobs: JobCardData[];
  loading: boolean;
  error: string | null;
  favorites: Set<number>;
  toggleFavorite: (jobId: number) => void;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useJobs(params: GetJobsParams = {}): UseJobsReturn {
  const getJobsUseCase = ServiceFactory.getInstance().getGetJobsUseCase();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const {
    data: rawJobs = [],
    isLoading,
    error,
    refetch: tanstackRefetch,
  } = useQuery<Job[], Error>({
    queryKey: ["jobs", params],
    queryFn: () => getJobsUseCase.execute(params),
    staleTime: Config.CACHE.TTL.DYNAMIC,
    gcTime: Config.CACHE.TTL.DYNAMIC * 4,
    retry: Config.QUERY.RETRY,
    refetchOnWindowFocus: Config.QUERY.REFETCH_ON_WINDOW_FOCUS,
  });

  const jobs: JobCardData[] = rawJobs.map((job: Job) => {
    const parsedSalary = parseSalary(job.salary);
    return {
      id: job.id.toString(),
      title: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      location: job.candidateRequiredLocation,
      salaryMin: parsedSalary.min,
      salaryMax: parsedSalary.max,
      currency: parsedSalary.currency,
      postedAt: formatPostedDate(job.publicationDate),
      tags: job.tags,
      isFavorite: favorites.has(job.id),
    };
  });

  const toggleFavorite = useCallback((jobId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  }, []);

  const refetch = useCallback(async () => {
    await tanstackRefetch();
  }, [tanstackRefetch]);

  const refresh = useCallback(async () => {
    await getJobsUseCase.invalidateCache(params);
    await tanstackRefetch();
  }, [getJobsUseCase, params, tanstackRefetch]);

  return {
    jobs,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    favorites,
    toggleFavorite,
    refetch,
    refresh,
  };
}
