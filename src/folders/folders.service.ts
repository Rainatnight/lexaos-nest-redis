import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folders.schema';
import { createId } from 'src/common/createId';
import { sanitizeHtml } from 'src/common/sanitizehtml';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<FolderDocument>,
  ) {}

  async getFolders(userId: string) {
    // Берём все папки пользователя, исключая служебные поля
    const items = await this.folderModel
      .find({ userId }, { __v: 0, userId: 0, createdAt: 0, updatedAt: 0 })
      .lean();

    return items.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }));
  }

  async createFolder(
    name: string,
    x: number,
    y: number,
    parentId: string,
    type: string,
    content: string,
    userId: string,
  ) {
    const folder = await this.folderModel.create({
      userId: userId,
      _id: createId(),
      type,
      name: name || 'Новая папка',
      x: x ?? 0,
      y: y ?? 0,
      parentId: parentId ?? null,
      content,
    });

    return { id: folder._id };
  }

  async clearBin(ids: string) {
    if (!Array.isArray(ids)) {
      throw new HttpException(
        {
          error: 'ids must be an array',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.folderModel.deleteMany({ _id: { $in: ids } });
  }

  async moveFolder(id: string, newX: number, newY: number, userId: string) {
    if (!id || !newX || !newY) {
      throw new HttpException(
        {
          error: 'id and newName are required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const folder = await this.folderModel
      .findOneAndUpdate(
        { _id: id, userId }, // проверяем, что папка принадлежит юзеру!
        { x: newX, y: newY },
        { new: true },
      )
      .lean();

    if (!folder) {
      throw new HttpException(
        {
          error: 'Folder not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return folder;
  }

  async renameFolder(id: string, newName: string, userId: string) {
    if (!id || !newName) {
      throw new HttpException(
        {
          error: 'id and newName are required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const folder = await this.folderModel
      .findOneAndUpdate(
        { _id: id, userId }, // проверяем, что папка принадлежит юзеру!
        { name: newName },
        { new: true },
      )
      .lean();

    if (!folder) {
      throw new HttpException(
        {
          error: 'Folder not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return folder;
  }

  async moveToFolder(
    id: string,
    parentId: string,
    x: number,
    y: number,
    userId: string,
  ) {
    // parentId может быть null (рабочий стол), так что не проверяем
    if (!id) {
      throw new HttpException(
        {
          error: 'id is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateData: { parentId: string; x?: number; y?: number } = {
      parentId,
    };

    if (typeof x === 'number') updateData.x = x;
    if (typeof y === 'number') updateData.y = y;

    const folder = await this.folderModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .lean();

    if (!folder) {
      throw new HttpException(
        {
          error: 'Folder not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return folder;
  }

  async saveText(id: string, content: string) {
    if (!id || typeof content !== 'string') {
      throw new HttpException(
        {
          error: 'id and content are required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (content.length > 100_000) {
      throw new HttpException(
        {
          error: 'Text file is too large',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const cleanContent = sanitizeHtml(content);

    const result = await this.folderModel.findOneAndUpdate(
      { _id: id, type: 'txt' },
      { content: cleanContent },
      { new: true },
    );

    if (!result) {
      throw new HttpException(
        {
          error: 'Text file not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { success: true };
  }
}
