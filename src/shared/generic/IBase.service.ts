export interface IBaseService<T> {
  getAll(): Promise<T[]>;
  get(id: number): Promise<T>;
  update(entity: T): Promise<T>;
  create(dto: T): Promise<number>;
  delete(id: number);
}
