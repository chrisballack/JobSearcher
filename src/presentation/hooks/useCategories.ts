import { useQuery } from "@tanstack/react-query";
import { ServiceFactory } from "@/infrastructure/di/ServiceFactory";
import { Category } from "@/domain/entities/Category";
import Config from "@/core/constants/Config";

export function useCategories() {
  const getCategoriesUseCase =
    ServiceFactory.getInstance().getGetCategoriesUseCase();

  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => getCategoriesUseCase.execute(),
    staleTime: Config.CACHE.TTL.STATIC,
    gcTime: Config.CACHE.TTL.STATIC * 7,
    retry: Config.QUERY.RETRY,
    refetchOnWindowFocus: Config.QUERY.REFETCH_ON_WINDOW_FOCUS,
    refetchOnReconnect: false,
  });
}
