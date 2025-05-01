export interface IUserRepository {
    getUserByID(id: string): Promise<{id: string, email: string}>;
    getUserByEmail(email: string): Promise<ASelectUser>;
    getAllUser(): Promise<ASelectUser[]>;
    createUser(email: string, password: string, username: string): Promise<AInsertUser>;
    deleteUser(id: string): Promise<boolean>;
}
