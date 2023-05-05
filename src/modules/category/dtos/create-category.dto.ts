import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { BaseCreateDto } from '../../../shared/base/dtos/create-base.dto';

export class CategoryCreateDto extends BaseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantity: number;
}
