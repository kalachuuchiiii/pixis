
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import type { IncomingMessage, Server, ServerResponse } from 'http';


export function configureApp(app: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>) {
    app.set('trust proxy', 1); // needed for secure cookies behind Vercel's proxy
    app.use(cookieParser());
    app.enableCors({
        origin: [process.env.CORS_ORIGIN ?? 'https://pixiflash.vercel.app', 'http://localhost:5173'], // Allowed origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    return app;
}