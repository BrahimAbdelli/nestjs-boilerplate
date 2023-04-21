import { Body, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ObjectID } from 'mongodb';
import { ValidateObjectIdPipe } from './../pipes/validate-object-id.pipe';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { BaseCreateDto } from './dtos/create-base.dto';
import { BaseUpdateDto } from './dtos/update-base.dto';

export abstract class BaseController<T extends BaseEntity, U extends BaseCreateDto, V extends BaseUpdateDto> {
  constructor(private readonly service: BaseService<T, U, V>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param(new ValidateObjectIdPipe('')) params): Promise<T> {
    return this.service.findOne(new ObjectID(params.id));
  }

  @Post()
  async create(@Body() dto: U): Promise<T> {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param(new ValidateObjectIdPipe('')) params, @Body() dto: V): Promise<T> {
    return this.service.update(new ObjectID(params.id), dto);
  }

  @Patch(':id')
  async archive(@Param(new ValidateObjectIdPipe('')) params): Promise<void> {
    return this.service.updateStatus(new ObjectID(params.id), true);
  }

  @Patch(':id')
  async restore(@Param(new ValidateObjectIdPipe('')) params): Promise<void> {
    return this.service.updateStatus(new ObjectID(params.id), false);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(new ObjectID(id));
  }

  @Delete()
  async clear(): Promise<void> {
    return this.service.clear();
  }
}
