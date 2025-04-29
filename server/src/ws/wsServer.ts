import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';
import { jwtVerify } from 'jose';
import { db } from '../db';
import { conversations } from '../db/schema/schema';
import { eq, or } from 'drizzle-orm';

const { upgradeWebSocket, websocket } = createBunWebSocket();
export const wsApp = new Hono();

export const userSockets = new Map<number, ServerWebSocket>();

export function pushToUser(userId: number, payload: unknown) {
  const sock = userSockets.get(userId);
  if (sock && sock.readyState === 1) {
    sock.send(JSON.stringify(payload));
  }
}

wsApp.get(
  '/ws',
  upgradeWebSocket((c) => {
    const token = c.req.query('token');

    let currentUserId: number | null = null;

    return {
      async onOpen(_, ws) {
        if (!token) {
          console.warn('[WS] missing token');
          ws.close();
          return;
        }

        try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
          const { payload } = await jwtVerify(token, secret);
          currentUserId = payload.userId as number;

          if (!currentUserId) {
            console.warn('[WS] invalid userId');
            ws.close();
            return;
          }

          userSockets.set(currentUserId, ws.raw as ServerWebSocket);
          console.log('[WS] user', currentUserId, 'connected ✅');
        } catch (err) {
          console.warn('[WS] invalid token');
          ws.close();
        }
      },

      async onMessage(event, ws) {
        if (!currentUserId) {
          console.warn('[WS] no user linked to this socket');
          ws.close();
          return;
        }

        const text =
          typeof event.data === 'string'
            ? event.data
            : new TextDecoder().decode(event.data);

        let parsed: any;
        try {
          parsed = JSON.parse(text);
        } catch {
          console.warn('[WS] received invalid JSON');
          return;
        }

        const { toUserId, content, conversationId } = parsed;
        if (!toUserId || !content || !conversationId) {
          console.warn('[WS] incomplete message payload', parsed);
          return;
        }

        try {
          const conv = await db.select().from(conversations).where(
            eq(conversations.id, conversationId)
          );

          if (!conv.length) {
            console.warn('[WS] conversation not found:', conversationId);
            return;
          }

          const conversation = conv[0];
          if (
            conversation.user1Id !== currentUserId &&
            conversation.user2Id !== currentUserId
          ) {
            console.warn('[WS] user', currentUserId, 'not authorized to send in conversation', conversationId);
            ws.close();
            return;
          }

          pushToUser(toUserId, {
            type: 'message',
            data: {
              id: Date.now(),
              userId: currentUserId,
              conversationId,
              content,
              createdAt: new Date().toISOString(),
            },
          });

        } catch (err) {
          console.error('[WS] Error handling message', err);
          ws.close();
        }
      },

      onClose() {
        if (currentUserId !== null) {
          userSockets.delete(currentUserId);
          console.log('[WS] user', currentUserId, 'disconnected ❌');
        }
      },
    };
  }),
);

export { websocket };
