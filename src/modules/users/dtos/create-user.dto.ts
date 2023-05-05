import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail } from 'class-validator';
import { BaseCreateDto } from './../../../shared/base/dtos/create-base.dto';
import { UserEntity } from '../entities/user.entity';
import { Unique } from '../../../shared/validators/unique-email.validator';

export class UserCreateDto extends BaseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 30)
  //@Unique(UserEntity, 'username', { message: 'Username must be unique' })
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  //@Unique(UserEntity, 'email', { message: 'Email must be unique' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
