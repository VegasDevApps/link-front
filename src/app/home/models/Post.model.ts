import { User } from "src/app/auth/model/user.model";

export interface Post {
    id: number;
    body: string;
    createdAt: Date;
    author: User;
}