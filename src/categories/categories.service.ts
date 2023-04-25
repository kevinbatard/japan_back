import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  async create(createCategoryDto: CreateCategoryDto): Promise<Category | null> {
    const category = new Category();
    category.name = createCategoryDto.name;

    await category.save();

    return await Category.findOne({
      select: { id: true, name: true },
      where: { id: category.id },
    });
  }

  async findAll(): Promise<Category[]> {
    return await Category.find();
  }

  async update(
    id: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category | null> {
    const category = await Category.findOne({ where: { id: id } });

    if (category !== null) {
      category.name = createCategoryDto.name;
      await category.save();

      return await Category.findOne({ where: { id: id } });
    }

    return null;
  }

  async remove(id: number): Promise<Category | null> {
    const category = await Category.findOne({ where: { id: id } });

    if (category !== null) {
      await category?.remove();
      return category;
    }
    return null;
  }
}
