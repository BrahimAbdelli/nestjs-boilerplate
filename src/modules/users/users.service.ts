import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { compile } from 'handlebars';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Email, connect } from 'node-mailjet';
import { Repository } from 'typeorm';
import { findByField } from '../../shared/utils/find-by-field.utils';
import { throwError } from '../../shared/utils/throw-error.utils';
import { IGetUserAuthInfoRequest } from './../../shared/user-request.interface';
import { LoginUserDto, UpdateNewPasswordDto, UserCreateDto, UserUpdateDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { IUser } from './interface/user.interface';
import { createHmac } from 'node:crypto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private mailjet: Email.Client;
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {
    this.mailjet = connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);
  }

  async findAll(): Promise<UserEntity[]> {
    const conditions = { status: true, isDeleted: false };
    const users = await this.userRepository.find({ where: conditions });
    return await this.populateUsers(users);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: createHmac('sha256', loginUserDto.password).digest('hex'),
      status: true,
      isDeleted: false
    };

    let authUser = await this.userRepository.findOne({ where: findOneOptions });
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
    const action_url = process.env.RESET_PASSWORD_URL + user.resetPasswordToken;
    const template = compile(fs.readFileSync('templates/reset.hbs', 'utf8'));
    const html = template({
      username: user.username,
      ip,
      action_url,
      browser_name,
      reset_password,
      support_email: process.env.SUPPORT_EMAIL
    });
    try {
      return await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_EMAIL,
              Name: 'Brahim'
            },
            To: [
              {
                //For testing purposes i used the same email
                Email: process.env.MAILJET_EMAIL,
                Name: user.name + ' ' + user.lastname
              }
            ],
            Subject: 'Reset your password',
            TextPart: 'My first Mailjet email',
            HTMLPart: html
          }
        ]
      });
    } catch (error) {
      throwError({ Email: error.message }, 'An error occured while sending reset mail');
    }
  }

  async create(dto: UserCreateDto): Promise<IUser> {
    const newUser = Object.assign(new UserEntity({}), dto);
    newUser.isDeleted = false;
    return await this.userRepository.save(newUser);
  }

  async update(toUpdate: UserEntity, dto: UserUpdateDto): Promise<IUser> {
    toUpdate.userCreated = this.request.user._id;
    toUpdate.userUpdated = this.request.user._id;
    Object.assign(toUpdate, dto);

    return this.populateUsers(await this.userRepository.save(toUpdate));
  }

  async archive(id: ObjectId): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { id }, true);
    user.status = false;
    user.isDeleted = true;

    return await this.userRepository.save(user);
  }

  async unarchive(id: ObjectId): Promise<IUser> {
    // throws error 404 if not found
    const user = await findByField(this.userRepository, { id }, true);
    user.status = true;
    user.isDeleted = false;

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

  generateJWT(user: UserEntity) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles
      },
      process.env.SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '15d' }
    );
  }

  generateResetPasswordJWT(user: UserEntity) {
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
      const { userCreated, userUpdated } = tmp[idx];

      if (userCreated)
        tmp[idx].userCreated = await findByField(this.userRepository, { _id: userCreated?._id ?? userCreated });

      if (userUpdated)
        tmp[idx].userUpdated = await findByField(this.userRepository, { _id: userUpdated?._id ?? userUpdated });
    }

    return Array.isArray(entities) ? tmp : tmp[0];
  }
}
