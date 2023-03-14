import { ObjectID } from 'mongodb';
import { DeepPartial } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;
  findById(_id: ObjectID): Promise<T>;
  update(_id: ObjectID, data: DeepPartial<T>): Promise<T>;
  create(data: DeepPartial<T>): Promise<T>;
  delete(id: number);
}
