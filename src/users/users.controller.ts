import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';
import { Request as ExpressRequest } from 'express';
import { UserType } from './schemas/users.type';

type RequestWithUser = ExpressRequest & { user: UserType };

@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-for-chat')
  @UseGuards(AuthStrictGuard)
  async getUsersForChat(@Req() req: RequestWithUser) {
    const { userId } = req.user;

    const users = await this.usersService.getUsersForChat('uLzCGmK6N4EXGrwKR');
    return { users };
  }
}
