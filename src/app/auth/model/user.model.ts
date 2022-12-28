import { Post } from "src/app/home/models/Post.model";

export type Role = 'admin' | 'premium' | 'user';

export interface User {
    lastName: string;
    firstName: string;
    email: string;
    role: Role;
    posts: Post[];
}