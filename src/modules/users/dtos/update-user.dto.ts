import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { BaseUpdateDto } from './../../../shared/base/dtos/update-base.dto';

export class UserUpdateDto extends BaseUpdateDto {
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
