import { uuid, pgTable, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { userTable } from "./user.schema";


export const conversationTable = pgTable('conversations', {
    id: serial('id').primaryKey(),
    user1Id: uuid('user1_id').notNull().references(() => userTable.id),
    user2Id: uuid('user2_id').notNull().references(() => userTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
