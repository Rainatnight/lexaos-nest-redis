import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrictGuard } from 'src/guards/authStrict.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, AuthStrictGuard], // guard локальный
  controllers: [AuthController],
  exports: [AuthStrictGuard], // чтобы другие модули могли его использовать
})
export class AuthModule {}
