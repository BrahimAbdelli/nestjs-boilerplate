import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'mongodb';
import { Repository } from 'typeorm';
import { findByField } from '../find-by-field.utils';
import { IGetUserAuthInfoRequest } from '../user-request.interface';
import { BaseEntity } from './base.entity';
import { BaseCreateDto } from './dtos/create-base.dto';
import { BaseUpdateDto } from './dtos/update-base.dto';

export abstract class BaseService<T extends BaseEntity, U extends BaseCreateDto, V extends BaseUpdateDto> {
  constructor(
    private readonly repository: Repository<T>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(_id: ObjectID): Promise<T> {
    return this.repository.findOne(_id);
  }

  createObject(dto: U | V): T {
    const newEntity = {} as T;
    return Object.assign(newEntity, dto);
  }

  /**
   *
   * @param data : the CreateDTO of the submitted entity
   * @returns : The created entity
   */
  async create(data: U): Promise<T> {
    const newEntity = this.createObject(data);
    newEntity.isDeleted = false;
    const entity = this.repository.create(newEntity as any);
    return this.repository.save(entity as any);
  }
  /**
   *
   * @param _id : the ID of the entity
   * @param dto : the DTO to be assigned for the entity
   * @returns : The modified entity
   */
  async update(_id: ObjectID, dto: V): Promise<T> {
    const entity = this.createObject(dto);
    entity.userUpdated = this.request.user._id;
    await this.repository.update(_id, entity as any);
    return this.repository.findOne(_id);
  }

  async delete(_id: ObjectID): Promise<void> {
    await this.repository.delete(_id);
  }

  /**
   *
   * @param _id : ObjectID of the given entity
   * This method applies logical deletion from the database by setting the isDeleted to true
   */
  async updateStatus(_id: ObjectID, isDeleted: boolean): Promise<void> {
    let entity = {} as T;
    entity.isDeleted = isDeleted;
    entity = await findByField(this.repository, { _id }, true);
    await this.repository.update(_id, entity as any);
  }

  /**
   *
   * @param _id : ObjectID of the given entity
   * This method applies logical restoration from the database by setting the isDeleted to false
   */
  /*   async restore(_id: ObjectID): Promise<void> {
    let entity = {} as T;
    entity.isDeleted = false;
    entity = await findByField(this.repository, { _id }, true);
    await this.repository.update(_id, entity as any);
  } */

  /**
   * This method deletes permanently from the database
   */
  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
