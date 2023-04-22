import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'mongodb';
import { DeepPartial, Repository } from 'typeorm';
import { findByField } from '../find-by-field.utils';
import { IGetUserAuthInfoRequest } from '../user-request.interface';
import { BaseEntity } from './base.entity';
import { BaseCreateDto } from './dtos/create-base.dto';
import { BaseUpdateDto } from './dtos/update-base.dto';
import { IBaseService } from './interfaces/base-service.interface';
import { PaginationConstants } from '../constants';

export abstract class BaseService<
  T extends BaseEntity,
  createDto extends BaseCreateDto,
  updateDto extends BaseUpdateDto
> implements IBaseService<T, createDto, updateDto>
{
  constructor(
    private readonly repository: Repository<T>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {}

  async findAll(condition = { isDeleted: false }): Promise<T[]> {
    let where = { ...condition };
    return this.repository.find({ where });
  }

  async paginate(take, skip, condition = { isDeleted: false }, type?): Promise<any> {
    const queryTake = Number(take) || PaginationConstants.DEFAULT_TAKE;
    const querySkip = Number(skip) || PaginationConstants.DEFAULT_SKIP;

    let where = { ...condition };
    if (type) {
      where = { ...condition, ...{ type } };
    }
    const [result, total] = await this.repository.findAndCount({
      where,
      //order: { createdAt: -1 },
      take: queryTake,
      skip: querySkip
    });
    return {
      data: result,
      count: total
    };
  }

  async findOne(_id: ObjectID): Promise<T> {
    return this.repository.findOne(_id);
  }

  createObject(dto: createDto | updateDto): T {
    const newEntity = {} as T;
    return Object.assign(newEntity, dto);
  }

  /**
   *
   * @param data : the CreateDTO of the submitted entity
   * @returns : The created entity
   */
  async create(data: createDto): Promise<T> {
    const newEntity = this.createObject(data);
    newEntity.isDeleted = false;
    //return await this.repository.save(newEntity as any);
    const entity = this.repository.create(newEntity as any);
    return this.repository.save(entity as any);
  }

  /**
   *
   * @param _id : the ID of the entity
   * @param dto : the DTO to be assigned for the entity
   * @returns : The modified entity
   */
  async update(_id: ObjectID, dto: updateDto): Promise<T> {
    const newEntity = await this.repository.preload({
      _id: (await this.repository.findOne(_id))._id,
      ...dto
    } as any);
    if (this.request.user) {
      newEntity.userCreated = this.request.user._id;
    }
    return this.repository.save(newEntity as DeepPartial<T>);
  }

  async delete(_id: ObjectID): Promise<void> {
    await this.repository.delete(_id);
  }

  /**
   *
   * @param _id : ObjectID of the given entity
   * This method applies logical deletion or restoration from the database by setting the isDeleted to true or false
   */
  async updateStatus(_id: ObjectID, isDeleted: boolean): Promise<T> {
    let entity = {} as T;
    entity = await findByField(this.repository, { _id }, true);
    entity.isDeleted = isDeleted;
    return await this.repository.save(entity as DeepPartial<T>);
  }

  /**
   * This method deletes permanently from the database
   */
  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
