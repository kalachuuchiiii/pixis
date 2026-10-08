
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../src/create-app';

type Handler = (
    req: IncomingMessage,
    res: ServerResponse,
) => void;

let cached: Promise<Handler> | undefined;

function getServer(): Promise<Handler> {
    cached ??= (async () => {
        const app = await createApp();
        await app.init();
        return app.getHttpAdapter().getInstance();
    })();

    return cached;
}

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse,
) {
    const server = await getServer();
    return server(req, res);
}