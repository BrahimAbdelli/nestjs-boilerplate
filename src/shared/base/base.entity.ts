import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, ObjectId, ObjectIdColumn } from 'typeorm';
import { IUser } from '../../modules/users/interface/user.interface';
import { transformEntity } from '../utils/transform-entity.utlis';

export abstract class BaseEntity {
  @ApiProperty()
  @ObjectIdColumn()
  @Transform(transformEntity)
  @Expose()
  public _id: ObjectId;

  @Column()
  @Expose()
  public isDeleted: boolean;

  @Column()
  @Transform(transformEntity)
  public userCreated: ObjectId | IUser;

  @Column()
  @Expose()
  protected createdAt: Date;

  @Column()
  @Transform(transformEntity)
  public userUpdated: ObjectId | IUser;

  @Column()
  @Expose()
  protected lastUpdateAt: Date;

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
