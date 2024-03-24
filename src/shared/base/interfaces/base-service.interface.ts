import { ObjectId } from 'mongodb';
import { QueryDto } from '../../search/search-dto';
import { ResponsePaginate } from 'src/shared/types/ResponsePaginate';

export interface IBaseService<T, createDto, updateDto> {
  findAll(): Promise<T[]>;
  paginate(take: number, skip: number): Promise<ResponsePaginate<T>>;
  create(entity: createDto): Promise<T>;
  update(_id: ObjectId, entity: updateDto): Promise<T>;
  findOne(_id: ObjectId): Promise<T>;
  updateStatus(_id: ObjectId, isDeleted: boolean): Promise<T>;
  delete(_id: ObjectId): Promise<void>;
  clear(): Promise<void>;
  search(data?: QueryDto<T>);
}
