import { Category } from "@/domain/entities/Category";
import { ICategoryRepository } from "@/domain/repositories/CategoryRepository";

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }
}
