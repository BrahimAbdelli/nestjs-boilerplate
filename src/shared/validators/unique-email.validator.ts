import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';
import { Repository, getConnection } from 'typeorm';
import { UserEntity } from '../../modules/users/entities/user.entity';
import { isFieldUnique } from '../utils/is-field-unique.utils';

@ValidatorConstraint({ async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async validate(value: any, args: any) {
    const [entityClass, property] = args.constraints;
    await isFieldUnique(this.userRepository, { username: args.object.username });
    await isFieldUnique(this.userRepository, { email: args.object.email });
    const repository = getConnection().getRepository(entityClass);
    const count = await repository.count({ [property]: value });
    return count === 0;
  }
}

export function Unique(entityClass: any, property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'unique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entityClass, property],
      options: validationOptions,
      validator: UniqueConstraint
    });
  };
}
