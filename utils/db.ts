import { Post, User } from "./types.ts";
import * as blob from "https://deno.land/x/kv_toolbox@0.0.2/blob.ts";
import { ulid } from "https://deno.land/x/ulid@v0.2.0/mod.ts";

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

export async function updateUserAvailabilities(
  id: string,
  availability: string,
) {
  const user = await getUserById(id);
  if (!user) throw new Error("user not found");
  user.availability = availability;
  await updateUser(user);
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

// 時間
type Time = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Availability = "unavailable" | "maybe" | "available";
const times = [
  "00:00 - 03:00",
  "03:00 - 06:00",
  "06:00 - 09:00",
  "09:00 - 12:00",
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 21:00",
  "21:00 - 24:00",
];
// Availabilityフォーマット
// <Day><Time><Availability>,<Day><Time><Availability>,....
// ex) 032,041,051,061,071,141,152,162,172,202,...

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
