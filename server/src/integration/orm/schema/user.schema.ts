import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return [
        uniqueIndex('users_username_unique').on(table.username),
        uniqueIndex('users_email_unique').on(table.email),
        uniqueIndex('users_phone_unique').on(table.phone),
    ];
});

export type ASelectUser = InferSelectModel<typeof userTable>;
export type AInsertUser = InferInsertModel<typeof userTable>;