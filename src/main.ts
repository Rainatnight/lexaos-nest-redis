import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fileUpload from 'express-fileupload';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // app.use(fileUpload({}) as any);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize() as any);

  await app.listen(5000, '0.0.0.0');
  console.log(`Server started on port ${5000}`);
}

bootstrap();
