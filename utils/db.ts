import {  Post, User } from "./types.ts";
import * as blob from "https://deno.land/x/kv_toolbox@0.0.2/blob.ts";
import { ulid } from "https://deno.land/x/ulid@v0.2.0/mod.ts";

// @ts-ignore: idk why but vscode extension warns
const kv = await Deno.openKv();

export async function setUserWithSession(user: User, session: string) {
  await kv
    .atomic()
    .set(["users", user.id], user)
    .set(["users_by_login", user.login], user)
    .set(["users_by_session", session], user)
    .commit();
}

export async function listUser() {
  const iter = await kv.list<User>({ prefix: ["users"] });
  const users: User[] = [];
  for await (const item of iter) {
    users.push(item.value);
  }
  return users;
}

export async function updateUser(user: User) {
  await kv.set(["users", user.id], user);
  await kv.set(["users_by_login", user.login], user);
}

export async function deleteUser(id: string) {
  await kv.delete(["users", id]);
  await kv.delete(["users_by_login", id]);
}

export async function getUserBySession(session: string) {
  const res = await kv.get<User>(["users_by_session", session]);
  return res.value;
}

export async function getUserById(id: string) {
  const res = await kv.get<User>(["users", id]);
  return res.value;
}

export async function getUserByLogin(login: string) {
  const res = await kv.get<User>(["users_by_login", login]);
  return res.value;
}

export async function deleteSession(session: string) {
  await kv.delete(["users_by_session", session]);
}

export function addImageData(uuid: string, data: ArrayBuffer) {
  const body = new Uint8Array(data);
  return blob.set(kv, ["imagedata", uuid], body);
}

export function removeImageData(uuid: string) {
  return blob.remove(kv, ["imagedata", uuid]);
}
export function getImageData(uuid: string) {
  return blob.get(kv, ["imagedata", uuid]);
}


export async function addPost(
  title: string,
  body: string,
  authorId: string,
) {
  const uuid = ulid();
  const post: Post = {
    id: uuid,
    title,
    body,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["posts", uuid], post);
}

export async function listPost() {
  const iter = await kv.list<Post>({ prefix: ["posts"] });
  const posts: Post[] = [];
  for await (const item of iter) {
    posts.push(item.value);
  }
  return posts;
}

export async function getPost(id: string) {
  const res = await kv.get<Post>(["posts", id]);
  return res.value;
}

export async function updatePost(
  id: string,
  title: string,
  body: string,
) {
  const post = await getPost(id);
  if (!post) throw new Error("post not found");
  post.title = title;
  post.body = body;
  post.updatedAt = new Date();
  await kv.set(["posts", id], post);
}

export async function deletePost(id: string) {
  await kv.delete(["posts", id]);
}