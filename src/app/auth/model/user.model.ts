import { Post } from "src/app/home/models/Post.model";

export type Role = 'admin' | 'premium' | 'user';

export interface User {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    role: Role;
    imagePath?: string;
    posts?: Post[];
}