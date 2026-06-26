import { GetJobsUseCase } from "../GetJobsUseCase";
import { IJobRepository } from "@/domain/repositories/JobRepository";
import { Job, GetJobsParams } from "@/domain/entities/Job";

describe("GetJobsUseCase", () => {
  let useCase: GetJobsUseCase;
  let mockRepository: jest.Mocked<IJobRepository>;

  const mockJobs: Job[] = [
    {
      id: 1,
      title: "Senior Developer",
      companyName: "TechCorp",
      companyLogo: "https://logo.com",
      category: "Engineering",
      tags: ["react", "typescript"],
      jobType: "full_time",
      publicationDate: "2026-06-23T08:27:20",
      candidateRequiredLocation: "Remote",
      salary: "$50k - $70k",
      description: "Job description",
      url: "https://example.com/1",
    },
    {
      id: 2,
      title: "Product Designer",
      companyName: "DesignHub",
      companyLogo: undefined,
      category: "Design",
      tags: ["figma", "ux"],
      jobType: "part_time",
      publicationDate: "2026-06-22T08:27:20",
      candidateRequiredLocation: "US",
      salary: "$40k - $60k",
      description: "Job description",
      url: "https://example.com/2",
    },
  ];

  const mockParams: GetJobsParams = {
    search: "developer",
    jobType: "full_time",
  };

  beforeEach(() => {
    mockRepository = {
      getJobs: jest.fn(),
      invalidateCache: jest.fn(),
    };

    useCase = new GetJobsUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("debería retornar jobs con los parámetros correctos", async () => {
      mockRepository.getJobs.mockResolvedValue(mockJobs);

      const result = await useCase.execute(mockParams);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Senior Developer");
      expect(mockRepository.getJobs).toHaveBeenCalledWith(mockParams);
    });

    it("debería manejar parámetros vacíos", async () => {
      const emptyParams: GetJobsParams = {};
      mockRepository.getJobs.mockResolvedValue(mockJobs);

      const result = await useCase.execute(emptyParams);

      expect(result).toHaveLength(2);
      expect(mockRepository.getJobs).toHaveBeenCalledWith(emptyParams);
    });

    it("debería retornar array vacío si no hay jobs", async () => {
      mockRepository.getJobs.mockResolvedValue([]);

      const result = await useCase.execute(mockParams);

      expect(result).toHaveLength(0);
    });

    it("debería llamar al repository exactamente una vez", async () => {
      mockRepository.getJobs.mockResolvedValue(mockJobs);

      await useCase.execute(mockParams);

      expect(mockRepository.getJobs).toHaveBeenCalledTimes(1);
    });

    it("debería propagar errores del repository", async () => {
      const error = new Error("Network error");
      mockRepository.getJobs.mockRejectedValue(error);

      await expect(useCase.execute(mockParams)).rejects.toThrow(
        "Network error",
      );
    });

    it("debería manejar búsqueda por texto", async () => {
      const searchParams: GetJobsParams = {
        search: "designer",
      };

      mockRepository.getJobs.mockResolvedValue([mockJobs[1]]);

      const result = await useCase.execute(searchParams);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("Design");
      expect(mockRepository.getJobs).toHaveBeenCalledWith(searchParams);
    });

    it("debería manejar filtro por jobType", async () => {
      const typeParams: GetJobsParams = {
        jobType: "part_time",
      };

      mockRepository.getJobs.mockResolvedValue([mockJobs[1]]);

      const result = await useCase.execute(typeParams);

      expect(result).toHaveLength(1);
      expect(result[0].jobType).toBe("part_time");
      expect(mockRepository.getJobs).toHaveBeenCalledWith(typeParams);
    });

    it("debería manejar combinación de filtros", async () => {
      const combinedParams: GetJobsParams = {
        search: "developer",
        jobType: "full_time",
      };

      mockRepository.getJobs.mockResolvedValue([mockJobs[0]]);

      const result = await useCase.execute(combinedParams);

      expect(result).toHaveLength(1);
      expect(mockRepository.getJobs).toHaveBeenCalledWith(combinedParams);
    });
  });

  describe("invalidateCache", () => {
    it("debería invalidar el cache con parámetros específicos", async () => {
      mockRepository.invalidateCache.mockResolvedValue(undefined);

      await useCase.invalidateCache(mockParams);

      expect(mockRepository.invalidateCache).toHaveBeenCalledWith(mockParams);
    });

    it("debería invalidar el cache sin parámetros", async () => {
      mockRepository.invalidateCache.mockResolvedValue(undefined);

      await useCase.invalidateCache();

      expect(mockRepository.invalidateCache).toHaveBeenCalledWith(undefined);
    });

    it("debería propagar errores al invalidar cache", async () => {
      const error = new Error("Cache error");
      mockRepository.invalidateCache.mockRejectedValue(error);

      await expect(useCase.invalidateCache(mockParams)).rejects.toThrow(
        "Cache error",
      );
    });
  });
});
