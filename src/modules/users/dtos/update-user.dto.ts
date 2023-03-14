import { BaseUpdateDto } from './../../../shared/base/dtos/update-base.dto';
import { ObjectID } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto extends BaseUpdateDto {}
