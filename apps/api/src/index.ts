import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cached: Promise<Handler> | undefined;

function getServer(): Promise<Handler> {
    cached ??= (async () => {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.set('trust proxy', 1); // needed for secure cookies behind Vercel's proxy
        app.use(cookieParser());
        app.enableCors({
            origin: [
                process.env.CORS_ORIGIN ?? 'https://pixiflash.vercel.app',
                'http://localhost:5173',
            ], // Allowed origins
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });

        await app.init(); // init, not listen
        return app.getHttpAdapter().getInstance();
    })().catch((err) => {
        console.error('NEST BOOT FAILED:', err);
        cached = undefined; // allow a retry on the next request
        throw err;
    });
    return cached;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const server = await getServer();
    return server(req, res);
}