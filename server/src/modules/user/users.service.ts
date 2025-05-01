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
    const body = await c.req.json<{
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    }>();

    const { username, email, firstName, lastName, phone } = body;

    if (!username || !email || !firstName || !lastName || !phone) {
      return c.json({ error: 'Tous les champs sont requis' }, 400);
    }

    const inserted = await db.insert(users).values({
      username,
      email,
      firstName,
      lastName,
      phone,
    }).returning();

    return c.json({
      message: 'Utilisateur créé avec succès',
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

userRoute.put('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);
    const body = await c.req.json<{
      username?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      bio?: string;
    }>();

    const fieldsToUpdate: any = {};
    if (body.username) fieldsToUpdate.username = body.username;
    if (body.firstName) fieldsToUpdate.firstName = body.firstName;
    if (body.lastName) fieldsToUpdate.lastName = body.lastName;
    if (body.phone) fieldsToUpdate.phone = body.phone;
    if (body.bio !== undefined) fieldsToUpdate.bio = body.bio;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    const updated = await db
      .update(users)
      .set(fieldsToUpdate)
      .where(eq(users.id, id))
      .returning();

    if (updated.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      message: 'User updated successfully',
      data: updated[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

userRoute.delete('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = Number(idParam);

    const existing = await db.select().from(users).where(eq(users.id, id));
    if (existing.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    await db.delete(users).where(eq(users.id, id));

    return c.json({
      message: 'User deleted successfully',
      data: existing[0],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export { userRoute };
