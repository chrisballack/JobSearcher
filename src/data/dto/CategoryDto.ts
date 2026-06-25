import { Category } from "../../domain/entities/Category";

// MARK: - API Response Models

export interface CategoriesApiResponse {
  "00-warning"?: string;
  "0-legal-notice"?: string;
  "job-count": number;
  "total-job-count": number;
  jobs: CategoryApiModel[];
}

export interface CategoryApiModel {
  id: number;
  name: string;
  slug: string;
}

// MARK: - Mapper

export class CategoryMapper {
  static toDomain(apiModel: CategoryApiModel): Category {
    return {
      id: apiModel.id,
      name: apiModel.name,
      slug: apiModel.slug,
    };
  }

  static toDomainList(apiModels: CategoryApiModel[]): Category[] {
    return apiModels.map((item: CategoryApiModel) =>
      CategoryMapper.toDomain(item),
    );
  }
}
