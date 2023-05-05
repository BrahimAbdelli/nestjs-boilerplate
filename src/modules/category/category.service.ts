import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../shared/base/base.service';
import { IGetUserAuthInfoRequest } from '../../shared/user-request.interface';
import { CategoryCreateDto, CategoryUpdateDto } from './dtos';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity, CategoryCreateDto, CategoryUpdateDto> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {
    super(categoryRepository, request);
  }
}
