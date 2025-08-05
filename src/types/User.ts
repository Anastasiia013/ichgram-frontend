export interface User {
  _id: string;
  username: string;
  fullname: string;
  bio: string;
  link: string;
  avatarUrl: string;
  followers: string[];
  following: string[];
}
