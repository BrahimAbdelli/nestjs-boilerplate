import { IsNotEmpty, IsEnum, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
import { cateogryStates } from '../entities/category.state.enum';
import { BaseUpdateDto } from '../../../shared/base/dtos/update-base.dto';

export class CategoryUpdateDto extends BaseUpdateDto {
  @ApiProperty()
  @IsOptional()
  state: cateogryStates;

  @ApiProperty()
  @IsOptional()
  @Length(4, 30)
  name: string;
}
