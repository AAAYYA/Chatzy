import { Hono } from 'hono';
import { db } from '../db'; 
import { users } from '../db/schema/schema';
import { eq } from 'drizzle-orm';

const userRoute = new Hono();

userRoute.get('/', async (c) => {
  const allUsers = await db.select().from(users);

  return c.json({
    message: 'Liste de tous les users',
    data: allUsers,
  });
});

userRoute.post('/', async (c) => {
  try {
    const body = await c.req.json<{ username: string }>();
    const { username } = body;

    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    const inserted = await db.insert(users).values({ username }).returning();

    return c.json({
      message: 'User created successfully',
      data: inserted[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

userRoute.get('/:id', async (c) => {
  const idParam = c.req.param('id');

  const id = Number(idParam);

  const userFound = await db.select().from(users).where(eq(users.id, id));

  if (userFound.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ data: userFound[0] });
});

export { userRoute };
