export interface Comment {
  _id: string;
  author: {
    username: string;
    avatarUrl: string;
  };
  text: string;
  likes: Array<
    | string // если просто id
    | { _id: string; username?: string; avatarUrl?: string } // если объект пользователя
  >;
  createdAt: string;
}
