import { IUser } from './../../modules/users/interface/user.interface';
import { BeforeInsert, BeforeUpdate, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { transformEntity } from '../transform-entity.utlis';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty()
  @ObjectIdColumn()
  @Transform(transformEntity)
  @Expose()
  _id?: ObjectID;

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

  /**************** ACTIONS ****************/

  @BeforeInsert()
  @BeforeUpdate()
  private beforeActions() {
    this.lastUpdateAt = new Date();
  }

  @BeforeInsert()
  private beforeInsertActions() {
    this.createdAt = new Date();
  }
}
