import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/upload')
  @UseGuards(AuthStrictGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException({ code: 'NOT_FOUND' }, HttpStatus.BAD_REQUEST);
    }

    return this.filesService.upload(file);
  }

  @Get(':fileId')
  @Header('Cache-Control', 'max-age=31536000')
  async download(@Param('fileId') fileId: string): Promise<StreamableFile> {
    const fileData = await this.filesService.getFileStream(fileId);
    if (!fileData) {
      throw new NotFoundException('File not exists');
    }

    return new StreamableFile(fileData.stream, {
      type: fileData.type,
      length: fileData.size,
    });
  }
}
