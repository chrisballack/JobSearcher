import { useFavoritesStore } from "../favoritesStore";
import { JobCardProps } from "@/presentation/components/JobCard";

jest.mock("@/core/constants/Config", () => ({
  __esModule: true,
  default: {
    IS_DEV: false,
  },
}));

const mockGetFavoritesUseCase = {
  execute: jest.fn(),
};

const mockToggleFavoriteUseCase = {
  execute: jest.fn(),
};

jest.mock("@/infrastructure/di/ServiceFactory", () => ({
  ServiceFactory: {
    getInstance: jest.fn(() => ({
      getGetFavoritesUseCase: jest.fn(() => mockGetFavoritesUseCase),
      getToggleFavoriteUseCase: jest.fn(() => mockToggleFavoriteUseCase),
    })),
  },
}));

describe("favoritesStore", () => {
  const mockJob1: JobCardProps = {
    id: "1",
    title: "Senior Developer",
    companyName: "TechCorp",
    location: "Remote",
    postedAt: "2 days ago",
    salaryMin: 50000,
    salaryMax: 70000,
    currency: "$",
  };

  const mockJob2: JobCardProps = {
    id: "2",
    title: "Product Designer",
    companyName: "DesignHub",
    location: "Remote",
    postedAt: "1 week ago",
    salaryMin: 40000,
    salaryMax: 60000,
    currency: "$",
  };

  beforeEach(() => {
    useFavoritesStore.setState({
      favorites: [],
      loading: false,
      initialized: false,
    });
    jest.clearAllMocks();
  });

  describe("toggleFavorite", () => {
    it("debería agregar un favorito si no existe", async () => {
      mockToggleFavoriteUseCase.execute.mockResolvedValue([mockJob1]);

      await useFavoritesStore.getState().toggleFavorite(mockJob1);

      const favorites = useFavoritesStore.getState().favorites;
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe("1");
      expect(mockToggleFavoriteUseCase.execute).toHaveBeenCalledWith(mockJob1);
    });

    it("debería remover un favorito si ya existe", async () => {
      mockToggleFavoriteUseCase.execute.mockResolvedValueOnce([mockJob1]);
      await useFavoritesStore.getState().toggleFavorite(mockJob1);
      expect(useFavoritesStore.getState().favorites).toHaveLength(1);
      mockToggleFavoriteUseCase.execute.mockResolvedValueOnce([]);
      await useFavoritesStore.getState().toggleFavorite(mockJob1);
      expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    });

    it("debería manejar múltiples favoritos", async () => {
      mockToggleFavoriteUseCase.execute
        .mockResolvedValueOnce([mockJob1])
        .mockResolvedValueOnce([mockJob1, mockJob2]);

      await useFavoritesStore.getState().toggleFavorite(mockJob1);
      await useFavoritesStore.getState().toggleFavorite(mockJob2);

      const favorites = useFavoritesStore.getState().favorites;
      expect(favorites).toHaveLength(2);
      expect(favorites.map((f) => f.id)).toEqual(["1", "2"]);
    });

    it("debería manejar errores sin romper el store", async () => {
      mockToggleFavoriteUseCase.execute.mockRejectedValue(
        new Error("Storage error"),
      );

      await useFavoritesStore.getState().toggleFavorite(mockJob1);

      expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    });
  });

  describe("isFavorite", () => {
    it("debería retornar true si el job es favorito", async () => {
      mockToggleFavoriteUseCase.execute.mockResolvedValue([mockJob1]);
      await useFavoritesStore.getState().toggleFavorite(mockJob1);

      expect(useFavoritesStore.getState().isFavorite("1")).toBe(true);
    });

    it("debería retornar false si el job no es favorito", () => {
      expect(useFavoritesStore.getState().isFavorite("999")).toBe(false);
    });

    it("debería retornar false después de remover el favorito", async () => {
      mockToggleFavoriteUseCase.execute
        .mockResolvedValueOnce([mockJob1])
        .mockResolvedValueOnce([]);

      await useFavoritesStore.getState().toggleFavorite(mockJob1);
      expect(useFavoritesStore.getState().isFavorite("1")).toBe(true);

      await useFavoritesStore.getState().toggleFavorite(mockJob1);
      expect(useFavoritesStore.getState().isFavorite("1")).toBe(false);
    });
  });

  describe("loadFavorites", () => {
    it("debería cargar favoritos del storage", async () => {
      mockGetFavoritesUseCase.execute.mockResolvedValue([mockJob1, mockJob2]);

      await useFavoritesStore.getState().loadFavorites();

      const state = useFavoritesStore.getState();
      expect(state.favorites).toHaveLength(2);
      expect(state.favorites[0].id).toBe("1");
      expect(state.favorites[1].id).toBe("2");
      expect(state.initialized).toBe(true);
      expect(state.loading).toBe(false);
    });

    it("no debería cargar si ya está initialized", async () => {
      mockGetFavoritesUseCase.execute.mockResolvedValue([mockJob1]);

      await useFavoritesStore.getState().loadFavorites();
      expect(mockGetFavoritesUseCase.execute).toHaveBeenCalledTimes(1);

      await useFavoritesStore.getState().loadFavorites();
      expect(mockGetFavoritesUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("debería manejar errores de carga", async () => {
      mockGetFavoritesUseCase.execute.mockRejectedValue(
        new Error("Storage error"),
      );

      await useFavoritesStore.getState().loadFavorites();

      const state = useFavoritesStore.getState();
      expect(state.loading).toBe(false);
      expect(state.favorites).toHaveLength(0);
    });

    it("debería setear loading durante la carga", async () => {
      mockGetFavoritesUseCase.execute.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([mockJob1]), 100);
          }),
      );

      const loadPromise = useFavoritesStore.getState().loadFavorites();
      expect(useFavoritesStore.getState().loading).toBe(true);

      await loadPromise;
      expect(useFavoritesStore.getState().loading).toBe(false);
    });
  });
});
