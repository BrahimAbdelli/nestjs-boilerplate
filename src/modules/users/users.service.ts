import { BaseService } from './../../shared/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private readonly productRepository: Repository<User>) {
    super(productRepository);
  }
}
