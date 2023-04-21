import { ObjectID } from 'mongodb';
import { ValidateObjectIdPipe } from '../../shared/pipes/validate-object-id.pipe';
import { CategoryService } from './category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Injectable,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  ParseBoolPipe
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { findByField } from '../../shared/find-by-field.utils';
import { BaseController } from '../../shared/base/base.controller';
import { CategoryCreateDto, CategoryUpdateDto } from './dtos';

@Controller('categories')
@ApiTags('categories')
export class CategoryController extends BaseController<CategoryEntity, CategoryCreateDto, CategoryUpdateDto> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }

  /*   @Post()
  @ApiBody({ type: [NewsletterCreateDto] })
  async createNewsletter(@Body() newsletterData: NewsletterCreateDto) {
    return await this.newsletterService.createNewsletter(newsletterData);
  } */

  /*   @Get()
  //@Roles(adminRoles.admin)
  async findAll(): Promise<CategoryEntity[]> {
    return await this.newsletterService.findAll(false);
  } */

  //This one overrides the one in basecontroller
  /*   @Get(':id')
  //@Roles(adminRoles.admin)
  @ApiBody({ description: 'id', required: true })
  async findOne(@Param(new ValidateObjectIdPipe('Newsletter')) params): Promise<CategoryEntity> {
    // throws error 404 if not found
    const newsletter = await findByField(this.newsletterRepository, { id: params.id }, true);
    return newsletter;
  } */

  /*   @Put(':id')
  //@Roles(adminRoles.admin)
  @ApiBody({ type: [CategoryUpdateDto] })
  async update(@Param(new ValidateObjectIdPipe('Category')) params, @Body() categoryData: CategoryUpdateDto) {
    // Check if entity exists  throws exception if not exists!
    const toUpdate = await findByField(this.categoryRepository, { _id: params.id }, true);
    return await this.categoryService.updateCategory(toUpdate, categoryData);
  } */

  /*   @Patch(':id')
  //@Roles(adminRoles.admin)
  async deleteLogic(@Param(new ValidateObjectIdPipe('Category')) params) {
    return await this.categoryService.deleteLogic(new ObjectID(params.id));
  } */
}
