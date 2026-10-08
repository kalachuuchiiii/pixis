import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from './create-app';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let cached: Promise<Handler> | undefined;

function getServer(): Promise<Handler> {
    cached ??= (async () => {
        const app = await createApp();

        await app.init();

        return app.getHttpAdapter().getInstance();
    })().catch((err) => {
        console.error('NEST BOOT FAILED:', err);
        cached = undefined;
        throw err;
    });

    return cached;
}

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse,
) {
    const server = await getServer();
    return server(req, res);
}