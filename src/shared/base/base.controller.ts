import { Body, Delete, Get, Param, Patch, Post, Put, Query, Type, UsePipes } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
import { AbstractValidationPipe } from '../pipes';
import { QueryDto } from '../search/search-dto';
import { ValidateObjectIdPipe } from './../pipes/validate-object-id.pipe';
import { BaseEntity } from './base.entity';
import { IBaseController } from './interfaces/base-controller.interface';
import { IBaseService } from './interfaces/base-service.interface';

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
    async paginate(@Query('take') take, @Query('skip') skip): Promise<T[]> {
      return this.service.paginate(+take, +skip);
    }

    @Get('find/:id')
    @ApiBody({ required: true, description: 'fetches the entity by ID' })
    async findOne(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.findOne(new ObjectID(params.id));
    }

    @Post()
    @UsePipes(createPipe)
    async create(@Body() dto: createDto): Promise<T> {
      return this.service.create(dto);
    }

    @Put(':id')
    @UsePipes(updatePipe)
    async update(@Param(new ValidateObjectIdPipe('')) params, @Body() dto: updateDto): Promise<T> {
      return this.service.update(new ObjectID(params.id), dto);
    }

    @Patch('archive/:id')
    async archive(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.updateStatus(new ObjectID(params.id), true);
    }

    @Patch('unarchive/:id')
    async unarchive(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
      return this.service.updateStatus(new ObjectID(params.id), false);
    }

    @Delete(':id')
    async delete(@Param(new ValidateObjectIdPipe('')) params): Promise<void> {
      return this.service.delete(new ObjectID(params.id));
    }

    @Delete()
    async clear(): Promise<void> {
      return this.service.clear();
    }

    @Get('search')
    @ApiBody({ type: [QueryDto] })
    async search(@Body() query: QueryDto<T>) {
      return this.service.search(query);
    }
  }
  return GenericsController;
}
