import { Hono } from 'hono';
import { db } from '../db';
import { friendships, users } from '../db/schema/schema';
import { eq, or, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';

const friendRoute = new Hono();

friendRoute.post('/', authMiddleware, async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json<{ recipientId: number }>();

    if (!body.recipientId || body.recipientId === userId) {
        return c.json({ error: 'Invalid recipient' }, 400);
    }

    const existing = await db.select().from(friendships).where(
        or(
            and(eq(friendships.requesterId, userId), eq(friendships.recipientId, body.recipientId)),
            and(eq(friendships.requesterId, body.recipientId), eq(friendships.recipientId, userId))
        )
    );

    if (existing.length > 0) {
        return c.json({ error: 'Friend request already exists or pending' }, 409);
    }

    const inserted = await db.insert(friendships).values({
        requesterId: userId,
        recipientId: body.recipientId,
        status: 'pending',
    }).returning();

    return c.json({ message: 'Friend request sent', data: inserted[0] });
});

friendRoute.get('/', authMiddleware, async (c) => {
    const userId = c.get('userId');

    const result = await db.select()
        .from(friendships)
        .where(
            and(eq(friendships.status, 'accepted'),
                or(
                    eq(friendships.requesterId, userId),
                    eq(friendships.recipientId, userId)
                )
            )
        );

    const friendIds = result.map(r => r.requesterId === userId ? r.recipientId : r.requesterId);

    const friends = await db.select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
    }).from(users).where(
        or(...friendIds.map(id => eq(users.id, id)))
    );

    return c.json({ data: friends });
});

export { friendRoute };