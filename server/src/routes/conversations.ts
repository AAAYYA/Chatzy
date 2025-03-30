import { Hono } from 'hono';
import { db } from '../db';
import { conversations } from '../db/schema/schema';
import { eq, and, or } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';
import { messages } from '../db/schema/schema';

const conversationRoute = new Hono();

conversationRoute.post('/', authMiddleware, async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json<{ recipientId: number }>();
    const { recipientId } = body;

    if (!recipientId || recipientId === userId) {
        return c.json({ error: 'Invalid recipient' }, 400);
    }

    const existing = await db.select().from(conversations).where(
        or(
            and(eq(conversations.user1Id, userId), eq(conversations.user2Id, recipientId)),
            and(eq(conversations.user1Id, recipientId), eq(conversations.user2Id, userId))
        )
    );

    if (existing.length > 0) {
        return c.json({ message: 'Conversation already exists', data: existing[0] });
    }

    const created = await db.insert(conversations).values({
        user1Id: userId,
        user2Id: recipientId,
    }).returning();

    return c.json({ message: 'Conversation created', data: created[0] });
});

conversationRoute.get('/', authMiddleware, async (c) => {
    const userId = c.get('userId');

    const result = await db
        .select()
        .from(conversations)
        .where(
            or(
                eq(conversations.user1Id, userId),
                eq(conversations.user2Id, userId)
            )
        );

    return c.json({ data: result });
});

conversationRoute.get('/:id/messages', authMiddleware, async (c) => {
    const userId = c.get('userId');
    const conversationId = Number(c.req.param('id'));

    if (!conversationId) {
        return c.json({ error: 'Missing conversation ID' }, 400);
    }

    const convo = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));

    if (!convo[0] || (convo[0].user1Id !== userId && convo[0].user2Id !== userId)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const convoMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId));

    return c.json({ data: convoMessages });
});

conversationRoute.post('/:id/messages', authMiddleware, async (c) => {
    const userId = c.get('userId');
    const conversationId = Number(c.req.param('id'));
    const body = await c.req.json<{ content: string }>();

    if (!body.content) {
        return c.json({ error: 'Message content required' }, 400);
    }

    const convo = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));

    if (!convo[0] || (convo[0].user1Id !== userId && convo[0].user2Id !== userId)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const inserted = await db.insert(messages).values({
        content: body.content,
        userId: userId,
        conversationId,
    }).returning();

    return c.json({ message: 'Message sent', data: inserted[0] });
});


export { conversationRoute };
