import type { ASelectUser, AInsertUser } from "../src/integration/orm/schema/user.schema";

export interface IUserRepository {
    getUserByID(id: string): Promise<ASelectUser>;
    getUserByEmail(email: string): Promise<ASelectUser>;
    getUserByUsername(username: string): Promise<ASelectUser>;
    getAllUser(): Promise<ASelectUser[]>;
    createUser(email: string, password: string, username: string): Promise<AInsertUser>;
    deleteUser(id: string): Promise<boolean>;
}
