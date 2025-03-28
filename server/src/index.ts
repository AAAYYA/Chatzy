import { Hono } from 'hono';
import { db } from './db';
import { users } from './db/schema/schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
      const newUser = await db.insert(users).values({
        username: 'TestUser'
      }).returning();
  
      const allUsers = await db.select().from(users);
  
      return c.json({
        message: 'Bienvenue sur Chatzy!',
        insertedUser: newUser,
        allUsers,
      });
    } catch (err: any) {
      if (err.code === '23505') {
        // Conflit de doublon (username déjà utilisé)
        const allUsers = await db.select().from(users);
        return c.json({
          message: 'User already exists',
          allUsers,
        });
      }
  
      throw err; // autre erreur non prévue
    }
  });
  
export default {
  port: 3000,
  fetch: app.fetch,
};
