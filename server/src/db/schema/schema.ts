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
    content: text('content').notNull(),
    userId: integer('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
