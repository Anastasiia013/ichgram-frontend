import type { User } from "./User";
import type { Comment } from "./Comment";

export interface Post {
  _id: string;
  author: User;
  imageUrl: string;
  caption?: string;
  likes: {
    username: string;
  }[];
  comments?: Comment[];
  createdAt: string;
}
