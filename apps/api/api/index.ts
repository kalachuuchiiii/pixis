import { createApp } from "../create-app";

let cached: Promise<any> | undefined;

function getServer() {
    if (!cached) {
        cached = (async () => {
            const app = await createApp();
            await app.init(); // init, not listen
            return app.getHttpAdapter().getInstance();
        })();
    }
    return cached;
}

export default async function handler(req: any, res: any) {
    const server = await getServer();
    return server(req, res);
}