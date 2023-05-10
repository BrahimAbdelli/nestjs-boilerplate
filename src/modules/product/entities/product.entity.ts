import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { transformEntity } from '../../../shared/utils/transform-entity.utlis';
import { IUser } from '../../users/interface/user.interface';

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

  @Column()
  @Expose()
  isDeleted: boolean;

  @Column()
  @Transform(transformEntity)
  userCreated: ObjectID | IUser;

  @Column()
  @Expose()
  createdAt: Date;

  @Column()
  @Transform(transformEntity)
  userUpdated: ObjectID | IUser;

  @Column()
  @Expose()
  lastUpdateAt: Date;
}
