import { Job, GetJobsParams } from "@/domain/entities/Job";

export interface IJobRepository {
  getJobs(params: GetJobsParams): Promise<Job[]>;
  invalidateCache(params?: GetJobsParams): Promise<void>;
}
