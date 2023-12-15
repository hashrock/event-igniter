export interface State {
  session: string | undefined;
}

export type UserRole = "admin" | "user" | "guest";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  availability?: string;
  email?: string;
}

export interface Comment {
  id: string;
  eventId: string;
  body: string;
  user: User;
  createdAt: Date;
}

export interface Interest {
  id: string;
  eventId: string;
  user: User;
  interest: number;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostDetail extends Post {
  comments: Comment[];
  interest: Interest[];
}
