import { Expose } from 'class-transformer';
import * as crypto from 'crypto';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @Column()
  @Expose()
  @Index({ unique: true })
  username: string;

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
  lastUpdateAt: Date;

  tempPassword?: string;
  /**************** ACTIONS ****************/
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private beforeActionsPassword() {
    if (this.tempPassword !== this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
    delete this.tempPassword;

    this.lastUpdateAt = new Date();
  }

  @BeforeInsert()
  private beforeInsertActionsUser() {
    this.status = true;
    this.createdAt = new Date();
  }

  constructor(o: Object) {
    super();
    Object.assign(this, o);
  }
}
