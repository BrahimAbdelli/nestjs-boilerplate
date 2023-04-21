import { UNIQUE_KEY_CONSTRAINT } from '../../../shared/constants/error.const';
import { BeforeInsert, BeforeUpdate, Column, Entity, ObjectIdColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
import { Transform, Expose, Exclude } from 'class-transformer';
import { cateogryStates } from './category.state.enum';
import { IUser } from '../../users/interface/user.interface';
import { transformEntity } from '../../../shared/transform-entity.utlis';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('category')
@Unique(UNIQUE_KEY_CONSTRAINT, ['name'])
@Exclude()
export class CategoryEntity extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  state: cateogryStates;

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
