import { JobCardProps } from "@/presentation/components/JobCard";

export interface IFavoriteRepository {
  getFavorites(): Promise<JobCardProps[]>;
  toggleFavorite(job: JobCardProps): Promise<JobCardProps[]>;
  isFavorite(jobId: string): Promise<boolean>;
  clearFavorites(): Promise<void>;
}
