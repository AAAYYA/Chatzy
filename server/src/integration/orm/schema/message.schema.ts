import { pgTable, serial, integer, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const messageTable = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').notNull(),
    userId: integer('user_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
