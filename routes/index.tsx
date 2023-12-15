import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { defineRoute } from "$fresh/server.ts";
import { getAuthenticatedUser } from "../utils/github.ts";
import { getUserById, getUserBySession, listPost } from "../utils/db.ts";
import Yotei from "../islands/Yotei.tsx";
import { User } from "../utils/types.ts";
import { LoginProps } from "./_middleware.tsx";

// 時間
type Time = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Availability = "unavailable" | "maybe" | "available";
const times = [
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 21:00",
  "21:00 - 24:00",
];
// Availabilityフォーマット
// <Day><Time><Availability>,<Day><Time><Availability>,....
// ex) 032,041,051,061,071,141,152,162,172,202,...

export default defineRoute<LoginProps>(async (req, ctx) => {
  const user = ctx.state.user;

  const posts = await listPost();

  return (
    <div>
      <h2 class="text-2xl font-bold">
        どんな話がしたい？
      </h2>

      <form class="mt-4 space-y-4" method="post" action="/api/new">
        <div class="">
          「
          <input
            class="border border-gray-400 text-xl px-2 py-1 rounded w-96"
            id="title"
            type="text"
            name="title"
            value=""
            placeholder="例) 今日の夜ご飯"
          />
          」 の話がしたい
        </div>

        <div>
          <button
            class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            type="submit"
          >
            提案する
          </button>
        </div>
      </form>

      <h2 class="mt-8 text-2xl font-bold">
        みんなのしたい話一覧
      </h2>

      {posts.map((post) => {
        return (
          <>
            <h3>
              <a class="block underline my-2" href={`/events/${post.id}`}>
                {post.title}
              </a>
            </h3>
          </>
        );
      })}

      {user === undefined && (
        <a href="/signin">
          Sign in with GitHub
        </a>
      )}

      {user !== undefined && (
        <div class="mt-16">
          <div class="flex items-center">
            <img
              class="w-8 h-8 mr-2 rounded-full"
              src={user.avatarUrl}
              alt={user.name}
            />
            <span class="text-lg font-bold">{user.name}さんのざっくり予定</span>
          </div>

          <Yotei
            userId={user.id}
            yotei={user.availability}
          />
        </div>
      )}
    </div>
  );
});
