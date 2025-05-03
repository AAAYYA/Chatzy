import app from "./src/server";

Bun.serve({
	fetch: app.fetch,
	port: 3000,
});
