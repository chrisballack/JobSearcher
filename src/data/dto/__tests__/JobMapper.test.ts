import { JobMapper, JobApiModel } from "../JobDto";
import { Job } from "@/domain/entities/Job";

describe("JobMapper", () => {
  describe("toDomain", () => {
    it("debería mapear correctamente un JobApiModel completo a Job", () => {
      const apiModel: JobApiModel = {
        id: 2090995,
        url: "https://remotive.com/remote-jobs/qa/senior-quality-engineer-2090995",
        title: "Senior Quality Engineer",
        company_name: "LawnStarter",
        company_logo: "https://remotive.com/job/2090995/logo",
        category: "Quality Assurance",
        tags: ["backend", "php", "react"],
        job_type: "full_time",
        publication_date: "2026-06-23T08:27:20",
        candidate_required_location: "Brazil",
        salary: "$45k - $65k",
        description: "<p>Job description</p>",
      };

      const result: Job = JobMapper.toDomain(apiModel);

      expect(result.id).toBe(2090995);
      expect(result.title).toBe("Senior Quality Engineer");
      expect(result.companyName).toBe("LawnStarter");
      expect(result.companyLogo).toBe("https://remotive.com/job/2090995/logo");
      expect(result.category).toBe("Quality Assurance");
      expect(result.tags).toEqual(["backend", "php", "react"]);
      expect(result.jobType).toBe("full_time");
      expect(result.publicationDate).toBe("2026-06-23T08:27:20");
      expect(result.candidateRequiredLocation).toBe("Brazil");
      expect(result.salary).toBe("$45k - $65k");
      expect(result.description).toBe("<p>Job description</p>");
    });

    it("debería convertir company_logo null a undefined", () => {
      const apiModel: JobApiModel = {
        id: 1,
        url: "https://example.com",
        title: "Developer",
        company_name: "TechCorp",
        company_logo: null,
        category: "Engineering",
        tags: [],
        job_type: "full_time",
        publication_date: "2026-06-23T08:27:20",
        candidate_required_location: "Remote",
        salary: "$50k",
        description: "Description",
      };

      const result = JobMapper.toDomain(apiModel);

      expect(result.companyLogo).toBeUndefined();
    });

    it("debería manejar tags vacío", () => {
      const apiModel: JobApiModel = {
        id: 1,
        url: "https://example.com",
        title: "Developer",
        company_name: "TechCorp",
        company_logo: null,
        category: "Engineering",
        tags: [],
        job_type: "full_time",
        publication_date: "2026-06-23T08:27:20",
        candidate_required_location: "Remote",
        salary: "$50k",
        description: "Description",
      };

      const result = JobMapper.toDomain(apiModel);

      expect(result.tags).toEqual([]);
      expect(Array.isArray(result.tags)).toBe(true);
    });

    it("debería convertir snake_case a camelCase en todos los campos", () => {
      const apiModel: JobApiModel = {
        id: 1,
        url: "https://example.com",
        title: "Developer",
        company_name: "TechCorp",
        company_logo: "https://logo.com",
        category: "Engineering",
        tags: ["react"],
        job_type: "full_time",
        publication_date: "2026-06-23T08:27:20",
        candidate_required_location: "Remote",
        salary: "$50k",
        description: "Description",
      };

      const result = JobMapper.toDomain(apiModel);

      // Verificar que los campos están en camelCase
      expect(result).toHaveProperty("companyName");
      expect(result).toHaveProperty("companyLogo");
      expect(result).toHaveProperty("jobType");
      expect(result).toHaveProperty("publicationDate");
      expect(result).toHaveProperty("candidateRequiredLocation");

      // Verificar que NO existen en snake_case
      expect(result).not.toHaveProperty("company_name");
      expect(result).not.toHaveProperty("company_logo");
      expect(result).not.toHaveProperty("job_type");
    });
  });

  describe("toDomainList", () => {
    it("debería mapear una lista de JobApiModel a Job[]", () => {
      const apiModels: JobApiModel[] = [
        {
          id: 1,
          url: "https://example.com/1",
          title: "Developer 1",
          company_name: "TechCorp 1",
          company_logo: null,
          category: "Engineering",
          tags: [],
          job_type: "full_time",
          publication_date: "2026-06-23T08:27:20",
          candidate_required_location: "Remote",
          salary: "$50k",
          description: "Description 1",
        },
        {
          id: 2,
          url: "https://example.com/2",
          title: "Developer 2",
          company_name: "TechCorp 2",
          company_logo: "https://logo.com",
          category: "Engineering",
          tags: ["react"],
          job_type: "part_time",
          publication_date: "2026-06-22T08:27:20",
          candidate_required_location: "US",
          salary: "$40k",
          description: "Description 2",
        },
      ];

      const result = JobMapper.toDomainList(apiModels);

      expect(result).toHaveLength(2);
      expect(result[0].companyName).toBe("TechCorp 1");
      expect(result[1].companyName).toBe("TechCorp 2");
      expect(result[1].companyLogo).toBe("https://logo.com");
    });

    it("debería retornar array vacío si la entrada está vacía", () => {
      const result = JobMapper.toDomainList([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
