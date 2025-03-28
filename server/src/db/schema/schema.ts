import { pgTable, serial, text, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  }, (table) => {
    return {
      usernameUnique: uniqueIndex('users_username_unique').on(table.username)
    }
  });

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
