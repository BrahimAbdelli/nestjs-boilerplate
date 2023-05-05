import { IsNotEmpty, Length, IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
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
