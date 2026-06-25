export interface Job {
  id: number;
  url: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  category: string;
  tags: string[];
  jobType: string;
  publicationDate: string;
  candidateRequiredLocation: string;
  salary: string;
  description: string;
}

export interface GetJobsParams {
  search?: string;
  categoryId?: number;
  jobType?: string;
  limit?: number;
}
