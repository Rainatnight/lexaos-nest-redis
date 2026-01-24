import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';
import { Request as ExpressRequest } from 'express';
import { UserType } from 'src/guards/userType';

type RequestWithUser = ExpressRequest & { user: UserType };

@Controller('/api/v1/folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get('find')
  @UseGuards(AuthStrictGuard)
  async getFolders(@Req() req: RequestWithUser) {
    const { userId } = req.user;
    return this.foldersService.getFolders(userId);
  }

  @Post('/create')
  @UseGuards(AuthStrictGuard)
  async CreateFolder(@Req() req: RequestWithUser) {
    const { name, x, y, parentId, type, content } = req.body;

    const { userId } = req.user;

    return this.foldersService.createFolder(
      name,
      x,
      y,
      parentId,
      type,
      content,
      userId,
    );
  }

  @Post('/clear-bin')
  @UseGuards(AuthStrictGuard)
  async clearBin(@Req() req: RequestWithUser) {
    const { ids } = req.body;

    return this.foldersService.clearBin(ids);
  }

  @Put('/move')
  @UseGuards(AuthStrictGuard)
  async moveFolder(@Req() req: RequestWithUser) {
    const { id, newX, newY } = req.body;
    const { userId } = req.user;

    return this.foldersService.moveFolder(id, newX, newY, userId);
  }

  @Put('/rename')
  @UseGuards(AuthStrictGuard)
  async renameFolder(@Req() req: RequestWithUser) {
    const { id, newName } = req.body;
    const { userId } = req.user;

    return this.foldersService.renameFolder(id, newName, userId);
  }

  @Put('/move-to-folder')
  @UseGuards(AuthStrictGuard)
  async moveToFolder(@Req() req: RequestWithUser) {
    const { id, parentId, x, y } = req.body;
    const { userId } = req.user;

    return this.foldersService.moveToFolder(id, parentId, x, y, userId);
  }

  @Put('/save-text')
  @UseGuards(AuthStrictGuard)
  async saveText(@Req() req: RequestWithUser) {
    const { id, content } = req.body;

    return this.foldersService.saveText(id, content);
  }
}
