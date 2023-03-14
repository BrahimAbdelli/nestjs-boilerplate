import { InjectRepository } from '@nestjs/typeorm';
import { BaseCreateDto } from './dtos/create-base.dto';
import { ObjectID } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IBaseService } from './IBase.service';

export abstract class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(_id: ObjectID): Promise<T> {
    return this.repository.findOne(_id);
  }

  async create(dto: any): Promise<T> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity as any);
  }

  async update(_id: ObjectID, dto: any): Promise<T> {
    await this.repository.update(_id, dto);
    return this.repository.findOne(_id);
  }

  async delete(_id: ObjectID): Promise<void> {
    await this.repository.delete(_id);
  }
}
