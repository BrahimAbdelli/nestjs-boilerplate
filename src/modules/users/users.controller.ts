import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../shared/generic/generic.controller';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<User> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
}
