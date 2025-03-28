import { Hono } from 'hono';
import type { Context } from 'hono';
import { db } from '../db';
import { messages } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';

const messagesRoute = new Hono();

messagesRoute.get('/', async (c) => {
  const allMessages = await db.select().from(messages);
  return c.json({ message: 'Liste de tous les messages', data: allMessages });
});

messagesRoute.post('/', authMiddleware, async (c: Context) => {
  try {
    const body = await c.req.json<{ content: string }>();
    const userId = Number(c.get('userId'));

    if (!body.content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    const inserted = await db.insert(messages).values({
      content: body.content,
      userId: userId,
    }).returning();

    return c.json({
      message: 'Message created successfully',
      data: inserted[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

messagesRoute.get('/:id', async (c) => {
  const idParam = c.req.param('id');
  const id = Number(idParam);
  const found = await db.select().from(messages).where(eq(messages.id, id));
  if (found.length === 0) {
    return c.json({ error: 'Message not found' }, 404);
  }
  return c.json({ data: found[0] });
});

messagesRoute.delete('/:id', authMiddleware, async (c: Context) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    const userId = c.get('userId');

    const existing = await db.select().from(messages).where(eq(messages.id, id));
    if (existing.length === 0) {
      return c.json({ error: 'Message not found' }, 404);
    }

    if (existing[0].userId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    await db.delete(messages).where(eq(messages.id, id));
    return c.json({ message: 'Message deleted successfully', data: existing[0] });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

messagesRoute.put('/:id', authMiddleware, async (c: Context) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    const body = await c.req.json<{ content: string }>();
    const userId = c.get('userId');

    if (!body.content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    const existing = await db.select().from(messages).where(eq(messages.id, id));
    if (!existing[0]) {
      return c.json({ error: 'Message not found' }, 404);
    }

    if (existing[0].userId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const updated = await db
      .update(messages)
      .set({ content: body.content })
      .where(eq(messages.id, id))
      .returning();

    return c.json({ message: 'Message updated', data: updated[0] });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export { messagesRoute };
