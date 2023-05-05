import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { BaseUpdateDto } from '../../../shared/base/dtos/update-base.dto';

export class CategoryUpdateDto extends BaseUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(4, 30)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantity: number;
}
