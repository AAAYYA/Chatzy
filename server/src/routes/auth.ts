import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

export const authRoute = new Hono();

authRoute.post('/login', async (c) => {
  try {
    const body = await c.req.json<{ username: string; password: string }>();
    const { username, password } = body;

    if (!username || !password) {
      return c.json({ error: 'Username et password requis' }, 400);
    }

    const found = await db.select().from(users).where(eq(users.username, username));
    const user = found[0];

    if (!user) {
      return c.json({ error: 'Utilisateur introuvable' }, 404);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return c.json({ error: 'Mot de passe incorrect' }, 403);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    return c.json({ token });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

authRoute.post('/register', async (c) => {
  try {
    const body = await c.req.json<{
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      password: string;
    }>();

    const { username, email, firstName, lastName, phone, password } = body;

    if (!username || !email || !firstName || !lastName || !phone || !password) {
      return c.json({ error: 'Tous les champs sont requis' }, 400);
    }

    const [byUsername, byEmail, byPhone] = await Promise.all([
      db.select().from(users).where(eq(users.username, username)),
      db.select().from(users).where(eq(users.email, email)),
      db.select().from(users).where(eq(users.phone, phone)),
    ]);

    if (byUsername.length || byEmail.length || byPhone.length) {
      return c.json({ error: 'Un utilisateur existe déjà avec ces informations' }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const inserted = await db.insert(users).values({
      username,
      email,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
    }).returning();

    const user = inserted[0];

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    return c.json({
      message: 'Inscription réussie',
      token,
      user,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});