import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import AppDataSource from './dataSource';
import { AppModule } from './app.module';


export async function createApp() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 1); // needed for secure cookies behind Vercel's proxy
    app.use(cookieParser());
    app.enableCors({
        origin: [process.env.CORS_ORIGIN as unknown as string, 'http://localhost:5173'], // Allowed origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
            credentials: true,
        }),
    );
    return app;
}