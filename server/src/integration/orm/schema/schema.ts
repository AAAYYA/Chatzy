import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const messageTable = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').notNull(),
    userId: integer('user_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationTable = pgTable('conversations', {
    id: serial('id').primaryKey(),
    user1Id: integer('user1_id').notNull(),
    user2Id: integer('user2_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const friendshipTable = pgTable('friendships', {
    id: serial('id').primaryKey(),
    requesterId: integer('requester_id').notNull(),
    recipientId: integer('recipient_id').notNull(),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
