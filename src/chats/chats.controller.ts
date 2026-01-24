import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';
import { Request as ExpressRequest } from 'express';
import { UserType } from 'src/guards/userType';
import { ChatsService } from './chats.service';

type RequestWithUser = ExpressRequest & { user: UserType };

@Controller('/api/v1/chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('/get-history')
  @UseGuards(AuthStrictGuard)
  async getHistory(@Req() req: RequestWithUser) {
    const { withUserId, skip = 0, limit = 10 } = req.query;

    const { userId } = req.user;
    return this.chatsService.getHistory(
      String(withUserId),
      Number(skip),
      Number(limit),
      String(userId),
    );
  }
}
