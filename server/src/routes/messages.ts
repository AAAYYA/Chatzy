import { Hono } from 'hono';
import { db } from '../db';
import { messages } from '../db/schema/schema';
import { eq } from 'drizzle-orm';

const messagesRoute = new Hono();

messagesRoute.get('/', async (c) => {
  const allMessages = await db.select().from(messages);
  return c.json({
    message: 'Liste de tous les messages',
    data: allMessages,
  });
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

messagesRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{ content: string; userId: number }>();
    const { content, userId } = body;
    if (!content || !userId) {
      return c.json({ error: 'Both content and userId are required' }, 400);
    }
    const inserted = await db.insert(messages).values({ content, userId }).returning();
    return c.json({
      message: 'Message created successfully',
      data: inserted[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

messagesRoute.delete('/:id', async (c) => {
  const idParam = c.req.param('id');
  const id = Number(idParam);
  const existing = await db.select().from(messages).where(eq(messages.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Message not found' }, 404);
  }
  await db.delete(messages).where(eq(messages.id, id));
  return c.json({
    message: 'Message deleted successfully',
    data: existing[0],
  });
});

messagesRoute.put('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    const body = await c.req.json<{ content?: string }>();
    const { content } = body;
    if (!content) {
      return c.json({ error: 'Content is required for update' }, 400);
    }
    const updated = await db
      .update(messages)
      .set({ content })
      .where(eq(messages.id, id))
      .returning();
    if (updated.length === 0) {
      return c.json({ error: 'Message not found' }, 404);
    }
    return c.json({
      message: 'Message updated successfully',
      data: updated[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export { messagesRoute };
