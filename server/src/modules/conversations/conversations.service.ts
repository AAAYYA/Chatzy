import { Hono, type MiddlewareHandler } from 'hono';
import { db } from '../../integration/orm/config';
import { messageTable } from '../../integration/orm/schema/message.schema';
import { conversationTable } from '../../integration/orm/schema/conversation.schema';
import { eq, or, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';
import { pushToUser } from '../../ws/wsServer';
import { AServer } from '../../../core/AServer';
import { logger } from 'hono/logger';


export class ConversationRoute extends AServer {
    constructor() {
        super("/conversations")
    }

    public routeHandler(): Hono {
        const conversationRoute = new Hono();
        
        this.middlewareHandler?.().forEach((middleware) => {
			conversationRoute.use(middleware);
		})

        conversationRoute.post('/', authMiddleware, async (c) => {
            const userId = c.get('userId');
            const { recipientId } = await c.req.json<{ recipientId: number }>();

            if (!recipientId || recipientId === userId) {
                return c.json({ error: 'Invalid recipient' }, 400);
            }

            const existing = await db
                .select()
                .from(conversationTable)
                .where(
                    or(
                        and(eq(conversationTable.user1Id, userId), eq(conversationTable.user2Id, recipientId)),
                        and(eq(conversationTable.user1Id, recipientId), eq(conversationTable.user2Id, userId)),
                    ),
                );

            if (existing.length) return c.json({ data: existing[0] });

            const [created] = await db
                .insert(conversationTable)
                .values({ user1Id: userId as number, user2Id: recipientId })
                .returning();

            return c.json({ data: created });
        });

        conversationRoute.get('/', authMiddleware, async (c) => {
            const userId = c.get('userId');
            const list = await db
                .select()
                .from(conversationTable)
                .where(or(eq(conversationTable.user1Id, userId), eq(conversationTable.user2Id, userId)));
            return c.json({ data: list });
        });

        conversationRoute.get('/:id/messages', authMiddleware, async (c) => {
            const userId = c.get('userId');
            const convoId = Number(c.req.param('id'));

            const [convo] = await db.select().from(conversationTable).where(eq(conversationTable.id, convoId));
            if (!convo || (convo.user1Id !== userId && convo.user2Id !== userId)) {
                return c.json({ error: 'Unauthorized' }, 403);
            }

            const msgs = await db
                .select()
                .from(messageTable)
                .where(eq(messageTable.conversationId, convoId));
            return c.json({ data: msgs });
        });

        conversationRoute.post('/:id/messages', authMiddleware, async (c) => {
            const userId = c.get('userId');
            const convoId = Number(c.req.param('id'));
            const { content } = await c.req.json<{ content: string }>();

            if (!content) return c.json({ error: 'Message content required' }, 400);

            const [convo] = await db
                .select()
                .from(conversationTable)
                .where(eq(conversationTable.id, convoId));

            if (!convo || (convo.user1Id !== userId && convo.user2Id !== userId)) {
                return c.json({ error: 'Unauthorized' }, 403);
            }

            const [saved] = await db
                .insert(messageTable)
                .values({ content, userId, conversationId: convoId })
                .returning();

            pushToUser(convo.user1Id, { type: 'message', data: saved });
            pushToUser(convo.user2Id, { type: 'message', data: saved });
            console.log('push sender', convo.user1Id, 'push recipient', convo.user2Id);
            return c.json({ data: saved });
        });

        return conversationRoute;
    }

    public middlewareHandler(): Array<MiddlewareHandler> {
        return [logger()]
    }
}
