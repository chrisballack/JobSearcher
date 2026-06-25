import { create } from "zustand";
import { ServiceFactory } from "@/infrastructure/di/ServiceFactory";
import { JobCardProps } from "@/presentation/components/JobCard";
import Config from "@/core/constants/Config";

interface FavoritesState {
  favorites: JobCardProps[];
  loading: boolean;
  initialized: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (job: JobCardProps) => Promise<void>;
  isFavorite: (jobId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,
  initialized: false,

  loadFavorites: async () => {
    if (get().initialized) return;

    try {
      set({ loading: true });
      const getFavoritesUseCase =
        ServiceFactory.getInstance().getGetFavoritesUseCase();
      const storedFavorites = await getFavoritesUseCase.execute();
      set({ favorites: storedFavorites, initialized: true });
    } catch (error) {
      if (Config.IS_DEV) {
        console.error("[favoritesStore] Failed to load favorites:", error);
      }
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (job: JobCardProps) => {
    try {
      const toggleFavoriteUseCase =
        ServiceFactory.getInstance().getToggleFavoriteUseCase();
      const updatedFavorites = await toggleFavoriteUseCase.execute(job);
      set({ favorites: updatedFavorites });
    } catch (error) {
      if (Config.IS_DEV) {
        console.error("[favoritesStore] Failed to toggle favorite:", error);
      }
    }
  },

  isFavorite: (jobId: string) => {
    return get().favorites.some((f: JobCardProps) => f.id === jobId);
  },
}));
