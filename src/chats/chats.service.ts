import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats, ChatsDocument } from './schemas/chats.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chats.name)
    private readonly chatsModel: Model<ChatsDocument>,
  ) {}

  async getHistory(
    withUserId: string,
    skip: number,
    limit: number,
    userId: string,
  ) {
    const messages = await this.chatsModel
      .find({
        $or: [
          { from: userId, to: withUserId },
          { from: withUserId, to: userId },
        ],
      })
      .sort({ createdAt: -1 }) // сначала последние сообщения
      .skip(Number(skip))
      .limit(Number(limit))
      .select('-createdAt -updatedAt -__v');

    return { messages: messages.reverse() };
  }
}
