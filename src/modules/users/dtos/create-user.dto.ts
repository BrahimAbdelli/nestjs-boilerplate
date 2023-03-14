import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail } from 'class-validator';
import { BaseCreateDto } from './../../../shared/base/dtos/create-base.dto';

export class UserCreateDto extends BaseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 30)
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
