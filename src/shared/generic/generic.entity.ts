import { IUser } from './../../modules/users/interface/user.interface';
import { BeforeInsert, BeforeUpdate, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { transformEntity } from '../transform-entity.utlis';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty()
  @ObjectIdColumn()
  @Transform(transformEntity)
  @Expose()
  private _id?: ObjectID;

  @Column()
  @Expose()
  private isDeleted: boolean;

  @Column()
  @Transform(transformEntity)
  private userCreated: ObjectID | IUser;

  @Column()
  @Expose()
  protected createdAt: Date;

  @Column()
  @Transform(transformEntity)
  private userUpdated: ObjectID | IUser;

  @Column()
  @Expose()
  protected lastUpdateAt: Date;

  /**************** ACTIONS ****************/

  @BeforeInsert()
  @BeforeUpdate()
  protected beforeActions() {
    this.lastUpdateAt = new Date();
  }

  @BeforeInsert()
  protected beforeInsertActions() {
    this.createdAt = new Date();
  }
}
