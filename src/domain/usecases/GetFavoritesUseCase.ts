import { IFavoriteRepository } from "@/domain/repositories/FavoriteRepository";
import { JobCardProps } from "@/presentation/components/JobCard";

export class GetFavoritesUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async execute(): Promise<JobCardProps[]> {
    return this.favoriteRepository.getFavorites();
  }
}
