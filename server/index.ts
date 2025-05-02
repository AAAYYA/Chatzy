import app from "./src/server";
import { websocket } from "./src/ws/wsServer";

Bun.serve({
	fetch: app.fetch,
	websocket,
	port: 3000,
});
