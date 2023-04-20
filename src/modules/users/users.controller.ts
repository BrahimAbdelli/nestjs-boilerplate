import { UserService } from './users.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../shared/base/base.controller';
import { UserEntity } from './entities/user.entity';
import { UserCreateDto, UserUpdateDto } from './dtos';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<UserEntity, UserCreateDto, UserUpdateDto> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
