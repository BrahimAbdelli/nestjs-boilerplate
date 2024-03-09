import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from "mongodb";

export abstract class BaseUpdateDto {
  @ApiProperty()
  private _id?: ObjectId;
}
