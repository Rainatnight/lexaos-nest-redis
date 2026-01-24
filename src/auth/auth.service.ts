import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { errorsCodes } from 'src/common/errors';
import * as dotenv from 'dotenv';
import { createId } from 'src/common/createId';

dotenv.config();

const DEFAULT_LOGIN_EXPIRATION_DAYS_METEOR = 90;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async login(login: string, password: string) {
    try {
      if (!password?.trim()) {
        throw new HttpException(
          {
            code: errorsCodes.INVALID_PASSWORD,
            msg: 'Invalid password',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userModel
        .findOne({ login })
        .select('login password')
        .lean();

      if (!user) {
        throw new HttpException(
          {
            code: errorsCodes.USER_NOT_FOUND,
            msg: 'User not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new HttpException(
          {
            code: errorsCodes.INVALID_PASSWORD,
            msg: 'Invalid password',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const expiredToken = new Date(
        Date.now() + DEFAULT_LOGIN_EXPIRATION_DAYS_METEOR * 86400000,
      );

      const token = jwt.sign(
        {
          userId: user._id,
          login: user.login,
        },
        process.env.jwtSecret,
        {
          expiresIn: Math.floor((expiredToken.getTime() - Date.now()) / 1000),
        },
      );

      return {
        token,
        expiredToken,
        userId: user._id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { code: errorsCodes.SOMETHING_WRONG },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(userId: string) {
    const user = await this.userModel.findOne(
      { _id: userId },
      {
        _id: 0,
        id: '$_id',
        login: 1,
      },
    );

    return user;
  }

  async createUser(login: string, password: string) {
    if (!login || !password) return;

    const existingUser = await this.userModel.findOne({ login }).lean();
    if (existingUser) {
      throw new HttpException(
        {
          code: errorsCodes.USER_ALREADY_VERIFIED,
          msg: 'User already exists',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      _id: createId(),
      login,
      password: hashedPassword,
    });

    const expiredToken = new Date(
      Date.now() + DEFAULT_LOGIN_EXPIRATION_DAYS_METEOR * 86400000,
    );

    const token = jwt.sign(
      {
        userId: newUser?._id,
        login: newUser.login,
      },
      process.env.jwtSecret,

      { expiresIn: expiredToken.getTime() },
    );
    return { token, expiredToken, userId: newUser._id, login };
  }
}
