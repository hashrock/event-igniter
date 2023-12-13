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
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
