import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { IncomingMessage, ServerResponse } from 'node:http';


type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cached: Promise<Handler> | undefined;

function getServer(): Promise<Handler> {
    cached ??= (async () => {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
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