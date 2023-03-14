import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

export abstract class BaseUpdateDto {
  @ApiProperty()
  private _id?: ObjectID;
}
