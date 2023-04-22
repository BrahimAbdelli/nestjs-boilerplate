import { BaseUpdateDto } from './../../../shared/base/dtos/update-base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';

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
