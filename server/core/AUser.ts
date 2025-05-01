import type { AInsertUser, ASelectUser } from "../src/integration/orm/schema/user.schema";
import type { IUserRepository } from "./IUser";

export abstract class AUser implements IUserRepository {
    abstract getAllUser(): Promise<ASelectUser[]>;
    abstract getUserByEmail(email: string): Promise<ASelectUser>;
    abstract getUserByID(id: string): Promise<{ id: string; email: string; }>;
    abstract createUser(email: string, password: string, username: string): Promise<AInsertUser>;
    abstract deleteUser(id: string): Promise<boolean>;
}
