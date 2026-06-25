import { IFavoriteRepository } from "@/domain/repositories/FavoriteRepository";
import { JobCardProps } from "@/presentation/components/JobCard";

export class ToggleFavoriteUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async execute(job: JobCardProps): Promise<JobCardProps[]> {
    return this.favoriteRepository.toggleFavorite(job);
  }
}
