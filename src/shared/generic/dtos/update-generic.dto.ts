import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

export class UpdateGenericDTO {
  @ApiProperty()
  private _id?: ObjectID;
}
