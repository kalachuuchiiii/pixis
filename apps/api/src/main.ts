import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppDataSource from '../dataSource';
import { env } from 'process';

const isProd = env.NODE_ENV === 'production';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    cors({
      origin: isProd ? env.CORS_ORIGIN : 'http://localhost:5173',
      credentials: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
