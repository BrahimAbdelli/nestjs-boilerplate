import { ObjectID } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateGenericDTO } from '../../../shared/generic/dtos/update-generic.dto';

export class UpdateUserDTO extends UpdateGenericDTO {}
