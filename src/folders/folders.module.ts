import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './schemas/folders.schema';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    AuthModule,
  ],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
