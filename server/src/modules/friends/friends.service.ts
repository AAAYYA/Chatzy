import { Hono, type MiddlewareHandler } from 'hono';
import { db } from '../../integration/orm/config';
import { friendshipTable } from '../../integration/orm/schema/schema';
import { userTable } from '../../integration/orm/schema/user.schema';
import { eq, or, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';
import { AServer } from '../../../core/AServer';
import { logger } from 'hono/logger';


export class FriendRoute extends AServer {
    constructor() {
        super('/friends');
    }

    public routeHandler(): Hono {
        const friendRoute = new Hono();

        friendRoute.get('/', authMiddleware, async (c) => {
            const userId = c.get('userId');
        
            const result = await db.select()
                .from(friendshipTable)
                .where(
                    and(eq(friendshipTable.status, 'accepted'),
                        or(
                            eq(friendshipTable.requesterId, userId as number),
                            eq(friendshipTable.recipientId, userId as number)
                        )
                    )
                );
        
            const friendIds = result.map(r =>
                r.requesterId === userId ? r.recipientId : r.requesterId
            );
        
            if (friendIds.length === 0) {
                return c.json({ data: [] });
            }
        
            const friends = await db.select({
                id: userTable.id,
                username: userTable.username,
                firstName: userTable.firstName,
                lastName: userTable.lastName,
                avatarUrl: userTable.avatarUrl,
                bio: userTable.bio,
            })
                .from(userTable)
                .where(
                    or(...friendIds.map(id => eq(userTable.id, id)))
                );
        
            return c.json({ data: friends });
        });

        friendRoute.get('/requests', authMiddleware, async (c) => {
            const userId = c.get('userId');
        
            const pending = await db
                .select({
                    id: friendshipTable.id,
                    requesterId: friendshipTable.requesterId,
                    createdAt: friendshipTable.createdAt,
                    username: userTable.username,
                    firstName: userTable.firstName,
                    lastName: userTable.lastName,
                    avatarUrl: userTable.avatarUrl,
                })
                .from(friendshipTable)
                .innerJoin(userTable, eq(friendshipTable.requesterId, userTable.id))
                .where(and(
                    eq(friendshipTable.recipientId, userId as number),
                    eq(friendshipTable.status, 'pending')
                ));
        
            return c.json({ data: pending });
        });

        friendRoute.post('/respond', authMiddleware, async (c) => {
            const userId = c.get('userId');
            const body = await c.req.json<{
                requestId: number;
                action: 'accept' | 'reject';
            }>();
        
            const { requestId, action } = body;
        
            if (!requestId || !['accept', 'reject'].includes(action)) {
                return c.json({ error: 'Invalid payload' }, 400);
            }
        
            const existing = await db.select().from(friendshipTable).where(eq(friendshipTable.id, requestId));
            const request = existing[0];
        
            if (!request || request.recipientId !== userId || request.status !== 'pending') {
                return c.json({ error: 'Invalid or unauthorized request' }, 403);
            }
        
            const updated = await db
                .update(friendshipTable)
                .set({ status: action === 'accept' ? 'accepted' : 'rejected' })
                .where(eq(friendshipTable.id, requestId))
                .returning();
        
            return c.json({ message: `Request ${action}ed`, data: updated[0] });
        });

        friendRoute.get('/debug', async (c) => {
            const all = await db.select().from(friendshipTable);
            return c.json({ data: all });
        });

        return friendRoute;
    }

    public middlewareHandler(): Array<MiddlewareHandler> {
        return [
            logger(),
        ]
    }
}
