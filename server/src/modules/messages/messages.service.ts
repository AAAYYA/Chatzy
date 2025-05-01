import { Hono } from 'hono';
import type { Context, MiddlewareHandler } from 'hono';
import { db } from '../../integration/orm/config';
import { messageTable } from '../../integration/orm/schema/message.schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';
import { AServer } from '../../../core/AServer';
import { logger } from 'hono/logger';


export class MessageRoute extends AServer {
	constructor() {
		super("/messages")
	}

	public routeHandler(): Hono {
		const messagesRoute = new Hono()

		messagesRoute.get('/', async (c) => {
			const allMessages = await db.select().from(messageTable);
			return c.json({ message: 'Liste de tous les messages', data: allMessages });
		});

		messagesRoute.post('/', authMiddleware, async (c: Context) => {
			try {
			  const body = await c.req.json<{ content: string }>();
			  const userId = Number(c.get('userId'));
		  
			  if (!body.content) {
				return c.json({ error: 'Content is required' }, 400);
			  }
		  
			  const inserted = await db.insert(messageTable).values({
				content: body.content as string,
				userId: userId as number,
				conversationId: 1,
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
			const found = await db.select().from(messageTable).where(eq(messageTable.id, id));
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
		  
			  const existing = await db.select().from(messageTable).where(eq(messageTable.id, id));
			  if (existing.length === 0) {
				return c.json({ error: 'Message not found' }, 404);
			  }
		  
			  if (existing[0].userId !== userId) {
				return c.json({ error: 'Unauthorized' }, 403);
			  }
		  
			  await db.delete(messageTable).where(eq(messageTable.id, id));
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
		  
			  const existing = await db.select().from(messageTable).where(eq(messageTable.id, id));
			  if (!existing[0]) {
				return c.json({ error: 'Message not found' }, 404);
			  }
		  
			  if (existing[0].userId !== userId) {
				return c.json({ error: 'Unauthorized' }, 403);
			  }
		  
			  const updated = await db
				.update(messageTable)
				.set({ content: body.content })
				.where(eq(messageTable.id, id))
				.returning();
		  
			  return c.json({ message: 'Message updated', data: updated[0] });
			} catch (err: any) {
			  return c.json({ error: err.message }, 500);
			}
		});

		return messagesRoute;
	}

	public middlewareHandler(): Array<MiddlewareHandler> {
		return [logger()]
	}
}
