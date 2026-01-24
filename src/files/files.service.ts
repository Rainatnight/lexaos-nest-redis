import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { createId } from 'src/common/createId';

@Injectable()
export class FilesService {
  async upload(file: Express.Multer.File) {
    try {
      const defaultPath = process.env.DATA_DIR || process.env.DEFAULT_FILE_PATH;

      const newName = createId();

      // убедимся, что директория существует
      if (!fs.existsSync(defaultPath)) {
        fs.mkdirSync(defaultPath, { recursive: true });
      }

      const filePath = path.join(defaultPath, newName);

      // multer даёт buffer
      fs.writeFileSync(filePath, file.buffer);

      fs.writeFileSync(
        `${filePath}.json`,
        JSON.stringify(
          {
            _id: newName,
            type: file.mimetype,
            title: file.originalname,
          },
          null,
          2,
        ),
        'utf8',
      );

      return { data: newName };
    } catch (e) {
      throw new HttpException(
        { code: 'SOMETHING_WRONG' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFileStream(fileId: string) {
    try {
      const defaultPath = process.env.DATA_DIR || process.env.DEFAULT_FILE_PATH;
      const filePath = path.join(defaultPath, fileId);
      const metaPath = `${filePath}.json`;

      const stat = await fs.promises.stat(filePath);
      const metaRaw = await fs.promises.readFile(metaPath, 'utf8');
      const meta = JSON.parse(metaRaw);

      return {
        stream: fs.createReadStream(filePath),
        type: meta.type,
        size: stat.size,
      };
    } catch {
      return null;
    }
  }
}
