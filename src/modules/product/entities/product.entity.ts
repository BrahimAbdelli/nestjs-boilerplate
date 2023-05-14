import { Exclude, Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('product')
@Exclude()
export class ProductEntity extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  price: number;

  @Column()
  @Expose()
  description: string;
}
