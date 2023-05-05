import { ObjectID } from 'mongodb';
import { QueryDto } from '../../search/search-dto';

export interface IBaseService<T, createDto, updateDto> {
  findAll(): Promise<T[]>;
  paginate(take: number, skip: number): Promise<T[]>;
  create(entity: createDto): Promise<T>;
  update(_id: ObjectID, entity: updateDto): Promise<T>;
  findOne(_id: ObjectID): Promise<T>;
  updateStatus(_id: ObjectID, isDeleted: boolean): Promise<T>;
  delete(_id: ObjectID): Promise<void>;
  clear(): Promise<void>;
  search(data?: QueryDto<T>);
}
