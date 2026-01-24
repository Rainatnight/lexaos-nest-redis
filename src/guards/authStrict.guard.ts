import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { UserType } from './userType';
import * as dotenv from 'dotenv';

dotenv.config();

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserType; // теперь TS знает, что такое req.user
  }
}

@Injectable()
export class AuthStrictGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (req.method === 'OPTIONS') return true;

    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No authorization');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('No authorization');

    try {
      const decoded = jwt.verify(token, process.env.jwtSecret) as UserType;

      const matchUser = await this.userModel
        .findOne({ _id: decoded.userId }, { login: 1 })
        .lean();

      if (!matchUser) throw new UnauthorizedException('No authorization');

      req.user = {
        userId: matchUser._id,
        login: matchUser.login,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
