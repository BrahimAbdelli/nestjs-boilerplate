import { ValidateObjectIdPipe } from './../pipes/validateObjectId.pipe';
import { BaseCreateDto } from './dtos/create-base.dto';
import { BaseService } from './base.service';
import { Get, Post, Delete, Put, Body, Param, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IBaseService } from './IBase.service';
import { BaseUpdateDto } from './dtos/update-base.dto';

export abstract class BaseController<T extends BaseEntity, U extends BaseCreateDto, V extends BaseUpdateDto> {
  constructor(private readonly service: BaseService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  //@Param('id') id: number
  // hello write me a console log
  @Get(':id')
  async findOne(@Param(new ValidateObjectIdPipe(this)) params): Promise<T> {
    return this.service.findOne(params.id);
  }

  @Post()
  async create(@Body() dto: U): Promise<T> {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: V): Promise<T> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
