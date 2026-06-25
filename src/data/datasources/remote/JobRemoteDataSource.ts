//
//  JobRemoteDataSource.ts
//  JobSearcher
//
//  Created by Christians Bonilla on 26/06/2026.
//  Copyright © 2026 JobSearcher. All rights reserved.
//

import { ApiService } from "@/infrastructure/http/ApiService";
import { JobsApiResponse } from "@/data/dto/JobDto";
import { GetJobsParams } from "@/domain/entities/Job";
import Config from "@/core/constants/Config";

export interface JobRemoteDataSource {
  getJobs(params: GetJobsParams): Promise<JobsApiResponse>;
}

export class JobRemoteDataSourceImpl implements JobRemoteDataSource {
  constructor(private apiService: ApiService) {}

  async getJobs(params: GetJobsParams): Promise<JobsApiResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.categoryId) {
      queryParams.append("category", params.categoryId.toString());
    }
    if (params.jobType) {
      queryParams.append("job_type", params.jobType);
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${Config.ENDPOINTS.JOBS}?${queryString}`
      : Config.ENDPOINTS.JOBS;

    return this.apiService.get<JobsApiResponse>(endpoint);
  }
}
