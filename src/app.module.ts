import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { FoldersModule } from './folders/folders.module';
import { ChatsModule } from './chats/chats.module';
import { FilesModule } from './files/files.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    FoldersModule,
    ChatsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
