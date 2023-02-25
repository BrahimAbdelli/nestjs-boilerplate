import { ObjectID } from 'mongodb';

export interface IUser {
  _id: ObjectID;
  email: string;
  // roles: string[];
  name: string;
  lastname: string;
  phone: string;
  address: string;
  about: string;
  resetPasswordToken?: string;
  image?: string;
}

export interface IUserLogin extends IUser {
  token: string;
}

export interface UserPop {
  user: IUser;
}
