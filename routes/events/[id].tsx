// Document https://fresh.deno.dev/docs/concepts/routes#define-helper

import { defineRoute } from "$fresh/server.ts";
import { getPost } from "../../utils/db.ts";

export default defineRoute(async (req, ctx) => {
  const id = ctx.params.id;
  const post = await getPost(id);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  return (
    <div class="page">
      <div class="mt-16">
        <h1 class="text-4xl font-bold text-center">
          「{post.title}」について話したい
        </h1>
      </div>

      <div class="text-center max-w-sm py-16 mx-auto">
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
        <h2 class="mt-4 text-2xl font-bold">例えばこんな話が聞きたい：</h2>
        <ul>
          {post.comments.map((comment) => (
            <li class="flex">
              <div>
                {comment.body}
              </div>
              <img
                width={16}
                height={16}
                src={comment.user.avatarUrl}
                alt={comment.user.name}
              />

              <div>
                <button class="px-2 py-1 text-sm rounded text-white bg-blue-500 hover:bg-blue-700">
                  聞きたい
                </button>
                <button class="px-2 py-1 text-sm rounded text-white bg-blue-500 hover:bg-blue-700">
                  話したい
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form action={`/api/events/${id}/comments`} method="POST" class="flex">
          <input
            class="mt-2 block w-full px-4 py-2 border border-gray-400 rounded"
            name="body"
            placeholder="例）和食にするか洋食にするか中華にするかの決め方"
          />
          <input
            class={"mt-2 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"}
            type="submit"
            value="追加"
          />
        </form>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl text-bold">興味ある人たち</h2>
        <ul class="mt-4">
          {post.interest.sort((a, b) => b.interest - a.interest)
            .map((interest) => (
              <li class="flex items-center">
                <img
                  width={32}
                  src={interest.user.avatarUrl}
                  alt={interest.user.name}
                />
                {interest.user.name}
                {interest.interest > 2 && (
                  <>
                    <span class="ml-2 px-1 py-0.5 text-sm rounded text-yellow-700 bg-yellow-200">
                      話したい
                    </span>
                  </>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h2 class="mt-4 text-2xl font-bold">開催日提案</h2>

        <div>
          2023/01/01 12:00
        </div>
        <div>
          2023/01/02 12:00
        </div>
        <div>
          2023/01/03 12:00
        </div>
        <div>
          2023/01/04 12:00
        </div>
        <div>
          2023/01/05 12:00 14:00
        </div>
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
