import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from './../users.service';

import { IGetUserAuthInfoRequest } from '../../../shared/user-request.interface';
import { throwError } from '../../../shared/utils/throw-error.utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    // get token from bearer token
    const token = req.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const { email } = jwt.verify(token, process.env.SECRET);
        //throws Error if user not found
        const user = await this.userService.findByEmail(email);
        // set populated user in request
        req.user = user;
        next();
      } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') throwError({ user: 'Invalid Token' }, 'Token Expired', 401);
        throwError({ user: 'Invalid Token' }, 'Invalid Token', 401);
      }
    } else throwError({ user: 'Not Authorized' }, 'Unauthorized', 401);
  }
}
