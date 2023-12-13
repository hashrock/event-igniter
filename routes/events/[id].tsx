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
      <div class="page__header">
        <h1 class="page__title">タイトル：{post.title}</h1>
      </div>
      <div class="page__body">
        <div class="page__content">
          <p>たとえば：{post.body}</p>
        </div>
      </div>

      <div>
        <form action={`/api/events/${id}/interest`} method="POST">
          <input
            class={"px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"}
            type="submit"
            value="興味ある"
          />
          <label class="block">
            <input type="radio" name="interest" value="0" />
            0: 聞きたいだけ
          </label>
          <label class="block">
            <input type="radio" name="interest" value="1" />
            1: 話題に自信ないけど会話に混ざるのはまんざらでもない
          </label>
          <label class="block">
            <input type="radio" name="interest" value="2" />
            2: 人が少なければ話すかも / 聞かれれば応答します
          </label>
          <label class="block">
            <input type="radio" name="interest" value="3" />
            3: 積極的に話したい
          </label>
          <label class="block">
            <input type="radio" name="interest" value="4" />
            4: 聞いてほしいことがある
          </label>
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
        <h2>コメント</h2>
        <ul>
          {post.comments.map((comment) => <li>{comment}</li>)}
        </ul>
      </div>
    </div>
  );
});
