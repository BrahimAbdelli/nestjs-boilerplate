import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'mongodb';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
import { PaginationConstants } from '../constants';
import { ComparaisonTypeEnum, ComparatorEnum, QueryDto } from '../search/search-dto';
import { SearchResponse } from '../search/search-response.dto';
import { IGetUserAuthInfoRequest } from '../user-request.interface';
import { findByField } from '../utils/find-by-field.utils';
import { BaseEntity } from './base.entity';
import { BaseCreateDto } from './dtos/create-base.dto';
import { BaseUpdateDto } from './dtos/update-base.dto';
import { IBaseService } from './interfaces/base-service.interface';

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
    const where: FindConditions<T> = { ...condition };
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
    // throws error 404 if not found
    const entity = await findByField(this.repository, { id: _id }, true);
    return await this.populate(entity);
    //return this.repository.findOne(_id);
  }

  private createObject(dto: createDto | updateDto): T {
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
    if (this.request.user) {
      newEntity.userCreated = this.request.user._id;
      newEntity.userUpdated = this.request.user._id;
    }
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
    let newEntity = this.createObject(dto);
    if (this.request.user) {
      newEntity.userUpdated = this.request.user._id;
    }
    newEntity = await this.repository.preload({
      _id: (await findByField(this.repository, { id: _id }, true))._id,
      ...dto
    } as any);

    return this.repository.save(newEntity as any);
  }

  async delete(_id: ObjectID): Promise<void> {
    await findByField(this.repository, { _id }, true);
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
    if (this.request.user) {
      entity.userUpdated = this.request.user._id;
    }
    return await this.repository.save(entity as any);
  }

  /**
   * This method deletes permanently from the database
   */
  async clear(): Promise<void> {
    try {
      await this.repository.clear();
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 26) {
        // Handle "ns not found" error
        // Perform alternative logic or error handling
        console.log('Collection does not exist. Unable to clear.');
      } else {
        // Handle other errors
        console.log('An error occurred:', error);
      }
    }
  }

  async search(data: QueryDto<T>): Promise<SearchResponse<T>> {
    const query: FindManyOptions<T> = { where: {} }; // initialize query to an empty object

    const queryTake = +data.take || PaginationConstants.DEFAULT_TAKE;
    const querySkip = +data.skip || PaginationConstants.DEFAULT_SKIP;
    const filterCriteria = data.attributes.map(attribute => {
      return {
        [attribute.key]:
          attribute.comparator == ComparatorEnum.EQUALS
            ? attribute.value
            : attribute.comparator == ComparatorEnum.LIKE
            ? RegExp(`^${attribute.value}`, 'i')
            : attribute.value
      };
    });
    query.where =
      data.type.toUpperCase() === ComparaisonTypeEnum.AND ? { $and: filterCriteria } : { $or: filterCriteria };
    const [result, total] = await this.repository.findAndCount({
      where: query.where,
      order: data.orders,
      ...(data.isPaginable == true || data.isPaginable == undefined
        ? {
            take: queryTake,
            skip: querySkip
          }
        : {})
    });
    return {
      data: result,
      count: total,
      ...(data.isPaginable == true || data.isPaginable == undefined
        ? {
            page: querySkip,
            totalPages: total == queryTake ? Math.trunc(total / queryTake) : Math.trunc(total / queryTake + 1)
          }
        : {})
    };
  }

  /**
   * Populate entit(y|ies) passed in paramter with "userCreated" and "userUpdated" properties
   * @param entities Array of entities OR an entity to populate
   * @returns Entit(y|ies) populated
   */
  private async populate(entities: Array<T> | any): Promise<Array<T> | any> {
    if (!entities) return;

    let tmp = entities;
    if (!Array.isArray(tmp)) tmp = [tmp];

    for (const idx in tmp) {
      const { userCreated, userUpdated } = tmp[idx];

      if (userCreated)
        tmp[idx].userCreated = await findByField(this.repository, { _id: userCreated?._id ?? userCreated });

      if (userUpdated)
        tmp[idx].userUpdated = await findByField(this.repository, { _id: userUpdated?._id ?? userUpdated });
    }

    return Array.isArray(entities) ? tmp : tmp[0];
  }
}
