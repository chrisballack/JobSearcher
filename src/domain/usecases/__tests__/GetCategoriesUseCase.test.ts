import { GetCategoriesUseCase } from "../GetCategoriesUseCase";
import { ICategoryRepository } from "@/domain/repositories/CategoryRepository";
import { Category } from "@/domain/entities/Category";

describe("GetCategoriesUseCase", () => {
  let useCase: GetCategoriesUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;

  const mockCategories: Category[] = [
    { id: 1, name: "Engineering", slug: "engineering" },
    { id: 2, name: "Design", slug: "design" },
    { id: 3, name: "Marketing", slug: "marketing" },
  ];

  beforeEach(() => {
    mockRepository = {
      getCategories: jest.fn(),
    };

    useCase = new GetCategoriesUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("debería retornar todas las categorías", async () => {
      mockRepository.getCategories.mockResolvedValue(mockCategories);

      const result = await useCase.execute();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Engineering");
      expect(result[1].name).toBe("Design");
      expect(result[2].name).toBe("Marketing");
    });

    it("debería retornar array vacío si no hay categorías", async () => {
      mockRepository.getCategories.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("debería llamar al repository exactamente una vez", async () => {
      mockRepository.getCategories.mockResolvedValue(mockCategories);

      await useCase.execute();

      expect(mockRepository.getCategories).toHaveBeenCalledTimes(1);
    });

    it("debería propagar errores del repository", async () => {
      const error = new Error("Network error");
      mockRepository.getCategories.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow("Network error");
    });

    it("debería manejar error de timeout", async () => {
      const error = new Error("Request timeout");
      mockRepository.getCategories.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow("Request timeout");
    });
  });
});
