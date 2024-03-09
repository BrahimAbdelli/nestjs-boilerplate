import { ObjectId } from "mongodb";

export interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  roles: string[];
  resetPasswordToken?: string;
}

export interface IUserLogin extends IUser {
  token: string;
}

export interface UserPop {
  user: IUser;
}
