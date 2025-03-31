import { Hono } from 'hono';
import { db } from '../db';
import { friendships, users } from '../db/schema/schema';
import { eq, or, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/authMiddleware';

const friendRoute = new Hono();

friendRoute.post('/', authMiddleware, async (c) => {
    const userId = c.get('userId');
    const { recipientUsername } = await c.req.json<{ recipientUsername: string }>();

    if (!recipientUsername) {
        return c.json({ error: 'recipientUsername is required' }, 400);
    }

    const [recipientUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, recipientUsername));

    if (!recipientUser) {
        return c.json({ error: 'No user found with this username' }, 404);
    }

    if (recipientUser.id === userId) {
        return c.json({ error: 'You cannot add yourself' }, 400);
    }

    const existing = await db
        .select()
        .from(friendships)
        .where(
            or(
                and(eq(friendships.requesterId, userId), eq(friendships.recipientId, recipientUser.id)),
                and(eq(friendships.requesterId, recipientUser.id), eq(friendships.recipientId, userId))
            )
        );

    if (existing.length > 0) {
        return c.json({ error: 'Friend request already exists or you are already friends' }, 409);
    }

    const inserted = await db
        .insert(friendships)
        .values({
            requesterId: userId,
            recipientId: recipientUser.id,
            status: 'pending',
        })
        .returning();

    return c.json({
        message: 'Friend request sent',
        data: inserted[0],
    });
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

    const friendIds = result.map(r =>
        r.requesterId === userId ? r.recipientId : r.requesterId
    );

    if (friendIds.length === 0) {
        return c.json({ data: [] });
    }

    const friends = await db.select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
    })
        .from(users)
        .where(
            or(...friendIds.map(id => eq(users.id, id)))
        );

    return c.json({ data: friends });
});

friendRoute.get('/requests', authMiddleware, async (c) => {
    const userId = c.get('userId');

    const pending = await db
        .select({
            id: friendships.id,
            requesterId: friendships.requesterId,
            createdAt: friendships.createdAt,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            avatarUrl: users.avatarUrl,
        })
        .from(friendships)
        .innerJoin(users, eq(friendships.requesterId, users.id))
        .where(and(
            eq(friendships.recipientId, userId),
            eq(friendships.status, 'pending')
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

    const existing = await db.select().from(friendships).where(eq(friendships.id, requestId));
    const request = existing[0];

    if (!request || request.recipientId !== userId || request.status !== 'pending') {
        return c.json({ error: 'Invalid or unauthorized request' }, 403);
    }

    const updated = await db
        .update(friendships)
        .set({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .where(eq(friendships.id, requestId))
        .returning();

    return c.json({ message: `Request ${action}ed`, data: updated[0] });
});

friendRoute.get('/debug', async (c) => {
    const all = await db.select().from(friendships);
    return c.json({ data: all });
});

export { friendRoute };