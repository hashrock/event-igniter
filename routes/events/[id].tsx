// Document https://fresh.deno.dev/docs/concepts/routes#define-helper

import { defineRoute } from "$fresh/server.ts";
import { getPost } from "../../utils/db.ts";

const interesetLabels = [
  "聞きたいだけ",
  "話題に自信ないけど会話に混ざるのはまんざらでもない",
  "人が少なければ話すかも / 聞かれれば応答します",
  "積極的に話したい",
  "聞いてほしいことがある",
];

export default defineRoute(async (req, ctx) => {
  const id = ctx.params.id;
  const post = await getPost(id);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  return (
    <div class="page">
      <div class="mt-16">
        <h1 class="text-4xl font-bold">「{post.title}」について話したい</h1>
      </div>

      <div>
        <form action={`/api/events/${id}/interest`} method="POST">
          <input
            class={"px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"}
            type="submit"
            value="興味ある"
          />

          <h2 class="mt-2 font-bold">聞きたい度</h2>
          <div>
            聞きたい←<input
              type="range"
              name="interest"
              min="0"
              max="4"
            />→話したい
          </div>
        </form>
      </div>

      <div>
        <h2>興味ある人たち</h2>
        <ul>
          {post.interest.map((interest) => (
            <li>
              <img
                width={32}
                src={interest.user.avatarUrl}
                alt={interest.user.name}
              />
              {interest.user.name} ({interesetLabels[interest.interest]})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 class="mt-4 text-2xl font-bold">コメント</h2>
        <ul>
          {post.comments.map((comment) => <li>{comment}</li>)}
        </ul>
      </div>

      <div>
        <h2 class="mt-4 text-2xl font-bold">作成者コマンド</h2>
        <form action={`/api/events/${id}/delete`} method="POST">
          <input
            class={"px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"}
            type="submit"
            value="このイベントを削除"
          />
        </form>
      </div>
    </div>
  );
});
