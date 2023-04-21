import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { REQUEST } from '@nestjs/core';
import { IGetUserAuthInfoRequest } from '../../shared/user-request.interface';
import { ObjectID } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { cateogryStates } from './entities/category.state.enum';
import { throwError } from '../../shared/throw-error.utils';
import { findByField } from '../../shared/find-by-field.utils';
import { BaseService } from '../../shared/base/base.service';
import { CategoryCreateDto, CategoryUpdateDto } from './dtos';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity, CategoryCreateDto, CategoryUpdateDto> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {
    super(categoryRepository, request);
  }

  async createCategory(dto: CategoryCreateDto): Promise<void> {
    const newCategory = Object.assign(new CategoryEntity(), dto);
    console.log('inside else');
    newCategory.isDeleted = false;
    newCategory.state = cateogryStates.waiting;
    try {
      await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error?.code === 11000) {
        throwError({ TagEntity: 'Duplicated value' }, 'Value exists', 405);
      }
      throw new Error('Something went wrong');
    }
  }
  async findById(id: string): Promise<CategoryEntity> {
    return await findByField(this.categoryRepository, { _id: id }, true);
  }

  /*   async findAll(isDeleted: boolean): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ isDeleted: isDeleted });
  } */

  async updateCategory(toUpdate: CategoryEntity, dto: CategoryUpdateDto): Promise<CategoryEntity> {
    toUpdate.userUpdated = this.request.user._id;
    Object.assign(toUpdate, dto);
    try {
      return await this.categoryRepository.save(toUpdate);
    } catch (error) {
      if (error?.code === 11000) {
        throwError({ TagEntity: 'Duplicated value' }, 'Value exists', 405);
      }
      throw new Error('Something went wrong');
    }
  }

  async deleteLogic(_id: ObjectID): Promise<CategoryEntity> {
    return await this.categoryRepository.save({
      _id: _id,
      isDeleted: true,
      userUpdated: this.request.user._id
    });
  }
}
