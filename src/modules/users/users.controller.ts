import { UserService } from './users.service';
import { UserUpdateDto } from './dtos/update-user.dto';
import { UserCreateDto } from './dtos/create-user.dto';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../shared/base/base.controller';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<User, UserCreateDto, UserUpdateDto> {
  constructor(private readonly userService: UserService) {
    super(userService, 'user');
  }
}
