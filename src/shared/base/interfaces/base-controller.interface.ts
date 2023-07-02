import { ObjectID } from 'mongodb';

import { QueryDto } from '../../search/search-dto';
import { BaseEntity } from '../base.entity';

export interface IBaseController<T extends BaseEntity, createDto, updateDto> {
  findAll(): Promise<T[]>;
  paginate(take: number, skip: number): Promise<T[]>;
  create(entity: createDto): Promise<T>;
  update(_id: ObjectID, entity: updateDto): Promise<T>;
  findOne(_id: ObjectID): Promise<T>;
  archive(_id: ObjectID): Promise<T>;
  unarchive(_id: ObjectID): Promise<T>;
  delete(_id: ObjectID): Promise<void>;
  clear(): Promise<void>;
  search(query: QueryDto<T>);
}
