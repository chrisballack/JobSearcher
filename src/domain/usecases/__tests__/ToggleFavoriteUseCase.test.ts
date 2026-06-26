import { IFavoriteRepository } from "@/domain/repositories/FavoriteRepository";
import { ToggleFavoriteUseCase } from "../ToggleFavoriteUseCase";
import { JobCardProps } from "@/presentation/components/JobCard";

describe("ToggleFavoriteUseCase", () => {
  let useCase: ToggleFavoriteUseCase;
  let mockRepository: jest.Mocked<IFavoriteRepository>;

  const mockJob: JobCardProps = {
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
  };

  beforeEach(() => {
    mockRepository = {
      getFavorites: jest.fn(),
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn(),
      clearFavorites: jest.fn(),
    };

    useCase = new ToggleFavoriteUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("debería agregar un favorito si no existe", async () => {
      mockRepository.toggleFavorite.mockResolvedValue([mockJob]);

      const result = await useCase.execute(mockJob);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
      expect(mockRepository.toggleFavorite).toHaveBeenCalledWith(mockJob);
      expect(mockRepository.toggleFavorite).toHaveBeenCalledTimes(1);
    });

    it("debería remover un favorito si ya existe", async () => {
      mockRepository.toggleFavorite.mockResolvedValue([]);

      const result = await useCase.execute(mockJob);

      expect(result).toHaveLength(0);
    });

    it("debería mantener otros favoritos al agregar uno nuevo", async () => {
      mockRepository.toggleFavorite.mockResolvedValue([mockJob2, mockJob]);

      const result = await useCase.execute(mockJob);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });

    it("debería mantener otros favoritos al remover uno", async () => {
      mockRepository.toggleFavorite.mockResolvedValue([mockJob2]);

      const result = await useCase.execute(mockJob);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("debería propagar errores del repository", async () => {
      const error = new Error("Storage error");
      mockRepository.toggleFavorite.mockRejectedValue(error);

      await expect(useCase.execute(mockJob)).rejects.toThrow("Storage error");
    });

    it("debería propagar error al guardar en storage", async () => {
      mockRepository.toggleFavorite.mockRejectedValue(new Error("Write error"));

      await expect(useCase.execute(mockJob)).rejects.toThrow("Write error");
    });
  });
});
