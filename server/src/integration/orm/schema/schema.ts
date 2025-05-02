import { pgTable, serial, text, varchar, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';

export const friendshipTable = pgTable('friendships', {
    id: serial('id').primaryKey(),
    requesterId: uuid('requester_id').notNull().references(() => userTable.id),
    recipientId: uuid('recipient_id').notNull().references(() => userTable.id),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
