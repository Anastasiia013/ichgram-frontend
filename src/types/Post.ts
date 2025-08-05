export interface Post {
  _id: string;
  author: string;
  imageUrl: string;
  caption?: string;
  likes: {
    username: string;
  }[];
  comments?: {
    username: string;
    text: string;
  }[];
  createdAt: string;
}
