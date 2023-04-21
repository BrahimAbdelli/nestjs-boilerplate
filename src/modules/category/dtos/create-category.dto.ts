import { IsNotEmpty, Length, IsPhoneNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
import { BaseCreateDto } from '../../../shared/base/dtos/create-base.dto';

export class CategoryCreateDto extends BaseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(4, 30)
  name: string;
}
