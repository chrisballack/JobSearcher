import { Job, GetJobsParams } from "@/domain/entities/Job";
import { IJobRepository } from "@/domain/repositories/JobRepository";

export class GetJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(params: GetJobsParams): Promise<Job[]> {
    return this.jobRepository.getJobs(params);
  }

  async invalidateCache(params?: GetJobsParams): Promise<void> {
    return this.jobRepository.invalidateCache(params);
  }
}
