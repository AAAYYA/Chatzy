import { eq } from "drizzle-orm";
import { AUser } from "../../../core/AUser";
import { db } from "../../integration/orm/config";
import { userTable, type AInsertUser, type ASelectUser } from "../../integration/orm/schema/user.schema";

export class UserRepository extends AUser {

    public async getAllUser(): Promise<ASelectUser[]> {
        return (await db.select().from(userTable))
    }

    public async getUserByEmail(email: string): Promise<ASelectUser> {
        return (await db.select().from(userTable).where(eq(userTable.email, email)))[0]
    }

    public async getUserByID(id: string): Promise<ASelectUser> {
        return (await db.select().from(userTable).where(eq(userTable.id, id)))[0]
    }

    public async getUserByUsername(username: string): Promise<ASelectUser> {
        return (await db.select().from(userTable).where(eq(userTable.username, username)))[0]
    }

    public async createUser(email: string, password: string, username: string): Promise<AInsertUser> {
        return (await db.insert(userTable).values({email, password, username}).returning())[0]
    }

    public async deleteUser(id: string): Promise<boolean> {
        const userDeleted = await db.delete(userTable).where(eq(userTable.id, id)).returning();
        return userDeleted.length > 0;
    }
}
