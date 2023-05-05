import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

export enum ComparatorEnum {
  LIKE = 'LIKE',
  EQUALS = 'EQUALS'
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum ComparaisonTypeEnum {
  AND = 'AND',
  OR = 'OR'
}

export class AttributeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ComparatorEnum)
  comparator: ComparatorEnum;

  @ApiProperty()
  @IsOptional()
  value: any;
}

export class QueryDto<T> {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  @ArrayMinSize(1)
  @IsNotEmpty()
  attributes: AttributeDto[];

  @ApiProperty()
  @IsOptional()
  @IsInt()
  take: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  skip: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ComparaisonTypeEnum)
  type: ComparaisonTypeEnum;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  orders: {
    [P in EntityFieldsNames<T>]?: OrderEnum.ASC | OrderEnum.DESC | 1 | -1;
  };

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPaginable: boolean;

  @IsEnum(OrderEnum, { each: true })
  get enumValidation() {
    if (this.orders) {
      const values = Object.values(this.orders) as OrderEnum[];
      if (values.length > 0) {
        return values;
      }
    }
    return null;
  }
}
