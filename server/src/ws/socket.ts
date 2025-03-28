import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

const app = new Hono();
const topic = 'chatzy-room';

const { upgradeWebSocket, websocket } = createBunWebSocket();

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    onOpen(event, ws) {
      const raw = ws.raw as ServerWebSocket;
      raw.subscribe(topic);
      console.log(`[WS] Client connected and subscribed to '${topic}'`);
    },
    onMessage(event, ws) {
      const message = event.data;
      if (!message) {
        console.warn('[WS] Message vide ou non défini');
        return;
      }
      const raw = ws.raw as ServerWebSocket;
      if (typeof message === 'string') {
        console.log('[WS] Message reçu (string):', message);
        raw.publish(topic, message);
      } else if (message instanceof Uint8Array) {
        const text = new TextDecoder().decode(message);
        if (text.trim() === '') {
          console.warn('[WS] Message vide après décodage');
          return;
        }
        console.log('[WS] Message reçu (texte décodé):', text);
        raw.publish(topic, text);
      } else {
        console.warn('[WS] Type de message inconnu:', typeof message, message);
      }
    },
    onClose(event, ws) {
      const raw = ws.raw as ServerWebSocket;
      raw.unsubscribe(topic);
      console.log(`[WS] Client disconnected from '${topic}'`);
    },
  }))
);

export { app as wsApp, websocket };
