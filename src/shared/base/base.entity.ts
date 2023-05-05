import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IUser } from '../../modules/users/interface/user.interface';
import { transformEntity } from '../utils/transform-entity.utlis';

export abstract class BaseEntity {
  @ApiProperty()
  @ObjectIdColumn()
  @Transform(transformEntity)
  @Expose()
  public _id: ObjectID;

  @Column()
  @Expose()
  public isDeleted: boolean;

  @Column()
  @Transform(transformEntity)
  public userCreated: ObjectID | IUser;

  @Column()
  @Expose()
  protected createdAt: Date;

  @Column()
  @Transform(transformEntity)
  public userUpdated: ObjectID | IUser;

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
