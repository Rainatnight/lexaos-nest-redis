import { UserType } from '../guards/userType'; // путь к твоему типу пользователя

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserType;
  }
}
