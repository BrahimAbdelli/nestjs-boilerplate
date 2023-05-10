import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { BaseUpdateDto } from '../../../shared/base/dtos/update-base.dto';

export class ProductUpdateDto extends BaseUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(3, 3000)
  description: string;
}
