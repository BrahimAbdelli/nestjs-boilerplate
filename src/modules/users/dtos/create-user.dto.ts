import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { BaseCreateDto } from './../../../shared/base/dtos/create-base.dto';

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
