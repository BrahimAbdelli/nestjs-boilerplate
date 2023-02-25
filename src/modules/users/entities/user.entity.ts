import { IUser } from './../interface/user.interface';
import { ObjectID } from 'mongodb';
import { Expose, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn, AfterLoad, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from '../../../shared/generic/generic.entity';
import { transformEntity } from '../../../shared/transform-entity.utlis';
import * as crypto from 'crypto';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 50 })
  readonly name: string;

  @Column({ length: 50 })
  readonly age: number;

  @Column({ length: 50 })
  readonly favouriteColor: string;

  @Expose()
  @ObjectIdColumn()
  @Transform(transformEntity)
  _id: ObjectID;

  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @Expose({ groups: ['user'] })
  @Column()
  resetPasswordToken?: string;

  @Expose()
  @Column()
  lastname: string;

  @Expose()
  @Column()
  address: string;

  @Expose()
  @Column()
  phone: string;

  @Expose()
  @Column()
  roles: string[];

  @Expose()
  @Column()
  image: string;

  @Expose()
  @Column()
  status: boolean;

  @Expose()
  @Column()
  about: string;

  @Column()
  @Expose()
  isDeleted: boolean;

  @Expose()
  @Column()
  @Transform(transformEntity)
  userCreated: ObjectID | IUser;

  @Expose()
  @Column()
  @Transform(transformEntity)
  userUpdated: ObjectID | IUser;

  @Expose()
  @Column()
  createdAt: Date;

  @Expose()
  @Column()
  lastUpdateAt: Date;

  tempPassword?: string;
  /**************** ACTIONS ****************/
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  /*   @BeforeInsert()
  @BeforeUpdate()
  private beforeActions() {
    if (this.tempPassword !== this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
    delete this.tempPassword;

    this.lastUpdateAt = new Date();
  }

  @BeforeInsert()
  private beforeInsertActions() {
    this.status = true;
    this.createdAt = new Date();
  } */

  constructor(o: Object) {
    super();
    Object.assign(this, o);
  }
}
