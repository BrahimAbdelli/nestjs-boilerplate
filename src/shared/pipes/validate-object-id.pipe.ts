import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from 'mongodb';
import { throwError } from '../utils/throw-error.utils';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<any> {
  constructor(private readonly entity: any) {}

  async transform(params: any) {
    if (!params?.id) throwError({ [this.entity ? this.entity : `${'Entity'}`]: 'Not found' }, 'No ID provided');

    if (!ObjectID.isValid(params.id))
      throwError({ [this.entity ? this.entity : `${'Entity'}`]: 'Not found' }, 'Check passed ID');
    return params;
  }
}
