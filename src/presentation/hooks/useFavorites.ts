import { useEffect } from "react";
import { useFavoritesStore } from "../stores/favoritesStore";

export function useFavorites() {
  const {
    favorites,
    loading,
    initialized,
    loadFavorites,
    toggleFavorite,
    isFavorite,
  } = useFavoritesStore();

  useEffect(() => {
    if (!initialized) {
      loadFavorites();
    }
  }, [initialized, loadFavorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
}
