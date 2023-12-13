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
      <div class="page__header">
        <h1 class="page__title">タイトル：{post.title}</h1>
      </div>
      <div class="page__body">
        <div class="page__content">
          <p>たとえば：{post.body}</p>
        </div>
      </div>
    </div>
  );
});
