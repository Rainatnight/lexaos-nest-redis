import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserType } from 'src/guards/userType';
import { AuthService } from './auth.service';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';

type RequestWithUser = ExpressRequest & { user: UserType };

@Controller('/api/v1/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('login')
  async loginFunc(@Req() req: RequestWithUser) {
    const { login, password } = req.body;

    const data = await this.authService.login(login, password);
    return data;
  }

  @Get('user')
  @UseGuards(AuthStrictGuard)
  async getUserData(@Req() req: RequestWithUser) {
    const { userId } = req.user as UserType;
    const data = await this.authService.getUser(userId);

    return { user: data };
  }

  @Post('/create')
  async createUser(@Req() req: RequestWithUser) {
    const { login, password } = req.body;
    const data = await this.authService.createUser(login, password);

    return data;
  }
}
