import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';

export const authRoute = new Hono();

authRoute.post('/login', async (c) => {
  try {
    const body = await c.req.json<{ username: string }>();
    if (!body.username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    const existingUser = await db.select().from(users).where(eq(users.username, body.username));
    if (existingUser.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const token = await new SignJWT({ userId: existingUser[0].id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    return c.json({ token });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
