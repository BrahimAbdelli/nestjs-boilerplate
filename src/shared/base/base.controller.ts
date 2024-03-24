import { Body, Delete, Get, Param, Patch, Post, Put, Query, Type, UsePipes } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { AbstractValidationPipe } from '../pipes';
import { QueryDto } from '../search/search-dto';
import { ValidateObjectIdPipe } from './../pipes/validate-object-id.pipe';
import { BaseEntity } from './base.entity';
import { IBaseController } from './interfaces/base-controller.interface';
import { IBaseService } from './interfaces/base-service.interface';
import { ResponsePaginate } from '../types/ResponsePaginate';

export function BaseController<T extends BaseEntity, createDto, updateDto>(
  createDto: Type<createDto>,
  updateDto: Type<updateDto>
): Type<IBaseController<T, createDto, updateDto>> {
  const createPipe = new AbstractValidationPipe({ whitelist: true, transform: true }, { body: createDto });
  const updatePipe = new AbstractValidationPipe({ whitelist: true, transform: true }, { body: updateDto });

  class GenericsController<T extends BaseEntity, createDto, updateDto>
    implements IBaseController<T, createDto, updateDto>
  {
    constructor(private readonly service: IBaseService<T, createDto, updateDto>) {}

    @Get()
    async findAll(): Promise<T[]> {
      return this.service.findAll();
    }

    @Get('paginate')
    @ApiQuery({ allowEmptyValue: true, name: 'take' })
    @ApiQuery({ allowEmptyValue: true, name: 'skip' })
    @ApiResponse({ description: 'returns results of pagination' })
    async paginate(@Query('take') take, @Query('skip') skip): Promise<ResponsePaginate<T>> {
      return this.service.paginate(+take, +skip);
    }

    @Get('find/:id')
    @ApiQuery({
      name: '_id',
      type: 'string',
      allowEmptyValue: false,
      description: 'used to update an object inside our database',
      required: true
    })
    async findOne(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.findOne(new ObjectId(params.id));
    }

    @Post()
    @UsePipes(createPipe)
    @ApiBody({ type: [createDto], required: true, description: 'used to create an object inside our database' })
    @ApiResponse({ description: 'returns the created entity' })
    async create(@Body() dto: createDto): Promise<T> {
      return this.service.create(dto);
    }

    @Put(':id')
    @UsePipes(updatePipe)
    @ApiBody({ type: [updateDto] })
    @ApiQuery({
      name: '_id',
      type: 'string',
      allowEmptyValue: false,
      description: 'used to update an object inside our database',
      required: true
    })
    async update(@Param(new ValidateObjectIdPipe('')) params, @Body() dto: updateDto): Promise<T> {
      return this.service.update(new ObjectId(params.id), dto);
    }

    @Patch('archive/:id')
    @ApiQuery({
      name: '_id',
      type: 'string',
      allowEmptyValue: false,
      description: 'used to archive an object inside our database',
      required: true
    })
    async archive(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.updateStatus(new ObjectId(params.id), true);
    }

    @Patch('unarchive/:id')
    @ApiQuery({
      name: '_id',
      type: 'string',
      allowEmptyValue: false,
      description: 'used to unarchive an object inside our database',
      required: true
    })
    async unarchive(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.updateStatus(new ObjectId(params.id), false);
    }

    @Delete(':id')
    @ApiQuery({
      name: '_id',
      type: 'string',
      allowEmptyValue: false,
      description: 'used to delete an object inside our database',
      required: true
    })
    async delete(@Param(new ValidateObjectIdPipe('')) params): Promise<void> {
      return this.service.delete(new ObjectId(params.id));
    }

    @Delete()
    @ApiQuery({
      description: 'This api clears the collections'
    })
    async clear(): Promise<void> {
      return this.service.clear();
    }

    @Get('search')
    @ApiBody({ type: [QueryDto], description: 'This api returns results after querying from the database' })
    async search(@Body() query: QueryDto<T>) {
      return this.service.search(query);
    }
  }
  return GenericsController;
}
