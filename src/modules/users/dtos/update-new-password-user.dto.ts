import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, Length } from 'class-validator';

export class UpdateNewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  readonly token: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(4, 16)
  readonly password: string;
}
