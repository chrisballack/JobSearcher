import { ApiService } from "@/infrastructure/http/ApiService";
import { CategoriesApiResponse } from "@/data/dto/CategoryDto";
import Config from "@/core/constants/Config";

export interface CategoryRemoteDataSource {
  getCategories(): Promise<CategoriesApiResponse>;
}

export class CategoryRemoteDataSourceImpl implements CategoryRemoteDataSource {
  constructor(private apiService: ApiService) {}

  async getCategories(): Promise<CategoriesApiResponse> {
    return this.apiService.get<CategoriesApiResponse>(
      Config.ENDPOINTS.CATEGORIES,
    );
  }
}
