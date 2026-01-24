import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsersForChat(userId: string) {
    const users = await this.userModel
      .find({ _id: { $ne: userId } }, { login: 1 })
      .lean()
      .exec();

    return users;
  }
}
