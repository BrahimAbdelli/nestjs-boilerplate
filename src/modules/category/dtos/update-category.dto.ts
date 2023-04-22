import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { BaseUpdateDto } from '../../../shared/base/dtos/update-base.dto';

export class CategoryUpdateDto extends BaseUpdateDto {
  @ApiProperty()
  @IsOptional()
  @Length(4, 30)
  name: string;
}
