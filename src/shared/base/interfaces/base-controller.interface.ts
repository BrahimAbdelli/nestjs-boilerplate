import { ObjectId } from 'mongodb';

import { QueryDto } from '../../search/search-dto';
import { BaseEntity } from '../base.entity';

export interface IBaseController<T extends BaseEntity, createDto, updateDto> {
  findAll(): Promise<T[]>;
  paginate(take: number, skip: number): Promise<T[]>;
  create(entity: createDto): Promise<T>;
  update(_id: ObjectId, entity: updateDto): Promise<T>;
  findOne(_id: ObjectId): Promise<T>;
  archive(_id: ObjectId): Promise<T>;
  unarchive(_id: ObjectId): Promise<T>;
  delete(_id: ObjectId): Promise<void>;
  clear(): Promise<void>;
  search(query: QueryDto<T>);
}
