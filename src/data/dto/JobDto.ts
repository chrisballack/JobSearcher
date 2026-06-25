import { Job } from "@/domain/entities/Job";

// ============================================================================
// API Response Models
// ============================================================================
export interface JobsApiResponse {
  "00-warning"?: string;
  "0-legal-notice"?: string;
  "job-count": number;
  "total-job-count": number;
  jobs: JobApiModel[];
}

export interface JobApiModel {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

// ============================================================================
// Mapper (API → Domain)
// ============================================================================
export class JobMapper {
  static toDomain(apiModel: JobApiModel): Job {
    return {
      id: apiModel.id,
      url: apiModel.url,
      title: apiModel.title,
      companyName: apiModel.company_name,
      companyLogo: apiModel.company_logo ?? undefined,
      category: apiModel.category,
      tags: apiModel.tags ?? [],
      jobType: apiModel.job_type,
      publicationDate: apiModel.publication_date,
      candidateRequiredLocation: apiModel.candidate_required_location,
      salary: apiModel.salary,
      description: apiModel.description,
    };
  }

  static toDomainList(apiModels: JobApiModel[]): Job[] {
    return apiModels.map((item: JobApiModel) => JobMapper.toDomain(item));
  }
}
