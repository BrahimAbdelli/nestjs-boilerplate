import { IGetUserAuthInfoRequest } from './../../shared/user-request.interface';
import { BaseService } from './../../shared/base/base.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { findByField } from '../../shared/utils/find-by-field.utils';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { IUser } from './interface/user.interface';
import { LoginUserDto, UpdateNewPasswordDto, UserCreateDto, UserUpdateDto } from './dtos';
import { throwError } from '../../shared/utils/throw-error.utils';

@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService<UserEntity, UserCreateDto, UserUpdateDto> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {
    super(userRepository, request);
  }

  /*   async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({ status: true });
    return await this.populateUsers(users);
  } */

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
      status: true
    };

    let authUser = await this.userRepository.findOne(findOneOptions);
    if (!authUser) throwError({ User: 'Not found' }, 'Authentication failed', 401);

    // if logged delete reset password token
    if (authUser.resetPasswordToken) {
      authUser.resetPasswordToken = undefined;
      authUser = await this.userRepository.save(authUser);
    }

    delete authUser.password;
    delete authUser.tempPassword;

    return authUser;
  }

  async forgotPassword(email: string): Promise<IUser> {
    // throws Error if user not found
    const user = await findByField(this.userRepository, { email }, true);
    const resetPasswordToken = this.generateResetPasswordJWT(user);
    user.resetPasswordToken = resetPasswordToken;
    user.userUpdated = user._id;
    return await this.userRepository.save(user);
  }

  async updateNewPassword(updateNewPasswordDto: UpdateNewPasswordDto): Promise<IUser> {
    const { token, password } = updateNewPasswordDto;
    try {
      const { email, username } = jwt.verify(token, process.env.SECRET);

      const user = await findByField(this.userRepository, { email });

      if (user.email !== email || user.username !== username || user.resetPasswordToken !== token)
        throwError({ user: 'Invalid Reset Password Token' }, 'Invalid Token', 401);

      user.password = password;
      user.resetPasswordToken = undefined;

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throwError({ user: 'Invalid Reset Password Token' }, 'Reset Password Token Expired', 401);

      throwError({ user: 'Invalid Reset Password Token' }, 'Invalid Token', 401);
    }
  }

  async sendResetPasswordEmail(user) {
    const reset_password = process.env.RESET_PASSWORD_EXPIRATION || '24h';
    const browser_name = this.request.headers['user-agent'] ?? 'Unkown Device';
    const ip = this.request.ip ?? 'Unknow Ip';
    const hostname = this.request.hostname;
    const action_url = process.env.RESET_PASSWORD_URL + user.resetPasswordToken;

    /*     try {
      return await this.mailerService.sendMail({
        to: user.email,
        from: '"Esprit administration 👻" <admin@esprit.tn>',
        subject: 'Reset password ✔',
        template: 'reset', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          name: user.username,
          ip,
          action_url,
          browser_name,
          reset_password,
          support_email: 'contact@esprit.tn'
        }
      });
    } catch (error) {
      throwError({ Email: error.message }, 'An error occured while sending reset mail');
    } */
  }

  async createUser(dto: UserCreateDto): Promise<IUser> {
    const newUser = Object.assign(new UserEntity({}), dto);
    newUser.userCreated = this.request.user._id;
    newUser.userUpdated = this.request.user._id;

    return await this.userRepository.save(newUser);
  }

  async updateUser(toUpdate: UserEntity, dto: UserUpdateDto): Promise<IUser> {
    toUpdate.userCreated = this.request.user._id;
    toUpdate.userUpdated = this.request.user._id;
    Object.assign(toUpdate, dto);

    return this.populateUsers(await this.userRepository.save(toUpdate));
  }

  async deleteUser(id: ObjectID): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { id }, true);
    if (!user.roles.includes('admin')) {
      user.status = false;
    }
    return await this.userRepository.save(user);
  }

  /**
   * Find user by email
   * @param email to search (unique index)
   * @throws Error if user not found
   * @returns {IUser} populated user
   */
  async findByEmail(email: string): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { email }, true);

    return this.populateUsers(user);
  }

  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        roles: user.roles,
        rdi: user.rdi,
        club: user.club
      },
      process.env.SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '15d' }
    );
  }

  generateResetPasswordJWT(user) {
    return jwt.sign(
      {
        email: user.email,
        username: user.username
      },
      process.env.SECRET,
      { expiresIn: process.env.RESET_PASSWORD_EXPIRATION || '24h' }
    );
  }

  /**
   * Populate entit(y|ies) passed in paramter with "userCreated" and "userUpdated" properties
   * @param entities Array of entities OR an entity to populate
   * @returns Entit(y|ies) populated
   */
  public async populateUsers(entities: Array<any> | any): Promise<Array<any> | any> {
    if (!entities) return;

    let tmp = entities;
    if (!Array.isArray(tmp)) tmp = [tmp];

    for (const idx in tmp) {
      const { userCreated, userUpdated, rdi, club } = tmp[idx];

      if (userCreated)
        tmp[idx].userCreated = await findByField(this.userRepository, { _id: userCreated?._id ?? userCreated });

      if (userUpdated)
        tmp[idx].userUpdated = await findByField(this.userRepository, { _id: userUpdated?._id ?? userUpdated });
    }

    return Array.isArray(entities) ? tmp : tmp[0];
  }
}
