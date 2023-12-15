// Document https://fresh.deno.dev/docs/concepts/routes#define-helper

import { defineRoute } from "$fresh/server.ts";
import { LoginProps } from "../_middleware.tsx";

export default defineRoute<LoginProps>(async (req, ctx) => {
  // const data = await loadData();
  const data = { name: "World" };

  if (!ctx.state.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return (
    <div class="page">
      <h1>New event</h1>

      <form method="post" action="/api/new">
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            class="border border-gray-400"
            id="title"
            type="text"
            name="title"
            value=""
          />
        </div>

        <button
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
});
