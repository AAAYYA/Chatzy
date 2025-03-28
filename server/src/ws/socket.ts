import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

const app = new Hono();
const topic = 'chatzy-room';

const { upgradeWebSocket, websocket } = createBunWebSocket();

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    onOpen(_, ws) {
      const raw = ws.raw as ServerWebSocket;
      raw.subscribe(topic);
      console.log(`[WS] Client connected and subscribed to '${topic}'`);
    },
    onMessage(_, ws, message) {
      const raw = ws.raw as ServerWebSocket;
      console.log(`[WS] Message received:`, message.toString());
      raw.publish(topic, message);
    },
    onClose(_, ws) {
      const raw = ws.raw as ServerWebSocket;
      raw.unsubscribe(topic);
      console.log(`[WS] Client disconnected from '${topic}'`);
    },
  }))
);

export { app as wsApp, websocket };
