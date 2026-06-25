import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ServiceFactory } from "@/infrastructure/di/ServiceFactory";
import { Job, GetJobsParams } from "@/domain/entities/Job";
import { parseSalary, formatPostedDate } from "@/core/utils/formatters";
import { useFavorites } from "@/presentation/hooks/useFavorites";
import { JobCardProps } from "@/presentation/components/JobCard";
import Config from "@/core/constants/Config";

export interface UseJobsReturn {
  jobs: JobCardProps[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (job: JobCardProps) => Promise<void>;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useJobs(
  params: GetJobsParams = {},
  localFilters: {
    search?: string;
    category?: string;
  } = {},
): UseJobsReturn {
  const getJobsUseCase = ServiceFactory.getInstance().getGetJobsUseCase();
  const {
    favorites,
    loading: favoritesLoading,
    toggleFavorite,
  } = useFavorites();

  const apiParams: GetJobsParams = {
    jobType: params.jobType,
    limit: params.limit,
  };

  const {
    data: rawJobs = [],
    isLoading,
    error,
    refetch: tanstackRefetch,
  } = useQuery<Job[], Error>({
    queryKey: ["jobs", apiParams],
    queryFn: () => getJobsUseCase.execute(apiParams),
    staleTime: Config.CACHE.TTL.DYNAMIC,
    gcTime: Config.CACHE.TTL.DYNAMIC * 4,
    retry: Config.QUERY.RETRY,
    refetchOnWindowFocus: Config.QUERY.REFETCH_ON_WINDOW_FOCUS,
  });

  const filteredJobs = useMemo(() => {
    let result = rawJobs;

    if (localFilters.category) {
      result = result.filter(
        (job: Job) =>
          job.category.toLowerCase() === localFilters.category!.toLowerCase(),
      );
    }

    if (localFilters.search) {
      const searchLower = localFilters.search.toLowerCase();
      result = result.filter(
        (job: Job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [rawJobs, localFilters.category, localFilters.search]);

  const jobs: JobCardProps[] = useMemo(() => {
    return filteredJobs.map((job: Job) => {
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
        isFavorite: favorites.some(
          (f: JobCardProps) => f.id === job.id.toString(),
        ),
      };
    });
  }, [filteredJobs, favorites]);

  const refetch = useCallback(async () => {
    await tanstackRefetch();
  }, [tanstackRefetch]);

  const refresh = useCallback(async () => {
    await getJobsUseCase.invalidateCache(apiParams);
    await tanstackRefetch();
  }, [getJobsUseCase, apiParams, tanstackRefetch]);

  return {
    jobs,
    loading: isLoading || favoritesLoading,
    error: error instanceof Error ? error.message : null,
    toggleFavorite,
    refetch,
    refresh,
  };
}
