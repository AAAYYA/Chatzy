import { Hono } from 'hono';
import { db } from '../db';
import { conversations, messages } from '../db/schema/schema';
import { eq, or, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';
import { pushToUser } from '../ws/wsServer';

export const conversationRoute = new Hono();

conversationRoute.post('/', authMiddleware, async (c) => {
  const userId     = c.get('userId');
  const { recipientId } = await c.req.json<{ recipientId: number }>();

  if (!recipientId || recipientId === userId) {
    return c.json({ error: 'Invalid recipient' }, 400);
  }

  const existing = await db
    .select()
    .from(conversations)
    .where(
      or(
        and(eq(conversations.user1Id, userId),     eq(conversations.user2Id, recipientId)),
        and(eq(conversations.user1Id, recipientId), eq(conversations.user2Id, userId)),
      ),
    );

  if (existing.length) return c.json({ data: existing[0] });

  const [created] = await db
    .insert(conversations)
    .values({ user1Id: userId, user2Id: recipientId })
    .returning();

  return c.json({ data: created });
});

conversationRoute.get('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const list = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.user1Id, userId), eq(conversations.user2Id, userId)));
  return c.json({ data: list });
});

conversationRoute.get('/:id/messages', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const convoId = Number(c.req.param('id'));

  const [convo] = await db.select().from(conversations).where(eq(conversations.id, convoId));
  if (!convo || (convo.user1Id !== userId && convo.user2Id !== userId)) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convoId));
  return c.json({ data: msgs });
});

conversationRoute.post('/:id/messages', authMiddleware, async (c) => {
  const userId   = c.get('userId');
  const convoId  = Number(c.req.param('id'));
  const { content } = await c.req.json<{ content: string }>();

  if (!content) return c.json({ error: 'Message content required' }, 400);

  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, convoId));

  if (!convo || (convo.user1Id !== userId && convo.user2Id !== userId)) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const [saved] = await db
    .insert(messages)
    .values({ content, userId, conversationId: convoId })
    .returning();

  pushToUser(convo.user1Id, { type: 'message', data: saved });
  pushToUser(convo.user2Id, { type: 'message', data: saved });
  console.log('push sender', convo.user1Id, 'push recipient', convo.user2Id);
  return c.json({ data: saved });
});

