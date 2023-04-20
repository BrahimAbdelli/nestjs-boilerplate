import { IsNotEmpty, IsJWT, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
