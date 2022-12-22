export type Role = 'admin' | 'premium' | 'user';

export interface User {
    lastName: string;
    firstName: string;
    email: string;
    role: Role;
}