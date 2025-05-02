import { pgTable, serial, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { conversationTable } from './conversation.schema';

export const messageTable = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').notNull().references(() => conversationTable.id),
    userId: uuid('user_id').references(() => userTable.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
