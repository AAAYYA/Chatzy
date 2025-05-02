import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, uuid, text, varchar, timestamp, uniqueIndex, boolean, date } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    password: varchar('password', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    is_verified: boolean("isVeridfied").default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return [
        uniqueIndex('userTable_username_idx').on(table.username),
        uniqueIndex('userTable_email_idx').on(table.email),
        uniqueIndex('userTable_phone_idx').on(table.phone),
    ];
});

export type ASelectUser = InferSelectModel<typeof userTable>;
export type AInsertUser = InferInsertModel<typeof userTable>;
