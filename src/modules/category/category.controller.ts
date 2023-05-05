import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../shared/base/base.controller';
import { CategoryService } from './category.service';
import { CategoryCreateDto, CategoryUpdateDto } from './dtos';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
@ApiTags('categories')
export class CategoryController extends BaseController<CategoryEntity, CategoryCreateDto, CategoryUpdateDto>(
  CategoryCreateDto,
  CategoryUpdateDto
) {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
