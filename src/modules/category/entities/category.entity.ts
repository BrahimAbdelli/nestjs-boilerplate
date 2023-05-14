import { Exclude, Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('category')
@Exclude()
export class CategoryEntity extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  quantity: number;
}
