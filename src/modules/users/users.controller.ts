import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidateObjectIdPipe } from '../../shared/pipes';
import { findByField } from '../../shared/utils/find-by-field.utils';
import { isFieldUnique } from '../../shared/utils/is-field-unique.utils';
import { LoginUserDto, UpdateNewPasswordDto, UserCreateDto, UserUpdateDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { IUser, IUserLogin } from './interface/user.interface';
import { UserService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService
  ) {}

  @Get('users')
  //@Roles(adminRoles.admin)
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get('user/email/:email')
  @ApiBody({ description: 'email', required: true })
  async findByEmail(@Param() params): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { email: params.email }, true);
    return this.userService.populateUsers(user);
  }

  @Get('user/username/:username')
  @ApiBody({ description: 'username', required: true })
  async findByUsername(@Param() params): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { username: params.username }, true);
    return await this.userService.populateUsers(user);
  }

  @Get('user/:id')
  @ApiBody({ description: 'id', required: true })
  async findById(@Param(new ValidateObjectIdPipe('User')) params): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { id: params.id }, true);
    return await this.userService.populateUsers(user);
  }

  @Post('user/login')
  @ApiBody({ type: [LoginUserDto] })
  async login(@Body() loginUserDto: LoginUserDto): Promise<IUserLogin> {
    // throws error 404 if not found
    const user = await this.userService.login(loginUserDto);

    const token = await this.userService.generateJWT(user);

    return { ...user, token };
  }

  @Post('user/forgot-password/:email')
  @ApiBody({ description: 'email', required: true })
  async forgotPassword(@Param() params): Promise<IUser> {
    // throws error 404 if not found
    const user = await this.userService.forgotPassword(params.email);

    await this.userService.sendResetPasswordEmail(user);
    return user;
  }

  @Post('user/reset-password')
  @ApiBody({ type: [UpdateNewPasswordDto] })
  async updateNewPassword(@Body() updateNewPasswordDto: UpdateNewPasswordDto): Promise<IUser> {
    return await this.userService.updateNewPassword(updateNewPasswordDto);
  }

  @Post('signup')
  //@Roles(adminRoles.admin, adminRoles.addRoles)
  @ApiBody({ type: [UserCreateDto] })
  async create(@Body() userData: UserCreateDto): Promise<IUser> {
    // check uniqueness of username/email & throws errors
    await isFieldUnique(this.userRepository, { username: userData.username });
    await isFieldUnique(this.userRepository, { email: userData.email });
    return await this.userService.createUser(userData);
  }

  @Put('user/:id')
  //@Roles(adminRoles.admin, adminRoles.addRoles)
  @ApiBody({ type: [UserUpdateDto] })
  async update(@Param(new ValidateObjectIdPipe('User')) params, @Body() userData: UserUpdateDto): Promise<IUser> {
    // Check if id exisits : throws error 404 if not found
    const toUpdate = await findByField(this.userRepository, { id: params.id }, true);

    // check uniqueness of username/email & throws errors
    await isFieldUnique(this.userRepository, { username: userData.username }, params.id);
    await isFieldUnique(this.userRepository, { email: userData.email }, params.id);

    return await this.userService.updateUser(toUpdate, userData);
  }

  @Delete('user/:id')
  //@Roles(adminRoles.admin)
  async delete(@Param(new ValidateObjectIdPipe('User')) params) {
    // throws error 404 if not found
    return await this.userService.deleteUser(params.id);
  }
}
