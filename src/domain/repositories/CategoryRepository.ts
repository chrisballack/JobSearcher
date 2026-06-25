import { Category } from "@/domain/entities/Category";

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
}
