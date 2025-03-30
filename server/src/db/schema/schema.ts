import { pgTable, serial, text, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        usernameUnique: uniqueIndex('users_username_unique').on(table.username),
        emailUnique: uniqueIndex('users_email_unique').on(table.email),
        phoneUnique: uniqueIndex('users_phone_unique').on(table.phone),
    };
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').notNull(),
    userId: integer('user_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
    id: serial('id').primaryKey(),
    user1Id: integer('user1_id').notNull(),
    user2Id: integer('user2_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const friendships = pgTable('friendships', {
    id: serial('id').primaryKey(),
    requesterId: integer('requester_id').notNull(),
    recipientId: integer('recipient_id').notNull(),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
