// Document https://fresh.deno.dev/docs/concepts/routes#mixed-handler-and-component-route

import { Handlers } from "$fresh/server.ts";
import { addPost } from "../../utils/db.ts";
import { User } from "../../utils/types.ts";
import { LoginProps } from "../_middleware.tsx";

export const handler: Handlers<LoginProps> = {
  async POST(req, ctx) {
    const user = ctx.state.user as User;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await req.formData();
    const title = form.get("title")?.toString();

    if (!title) {
      return new Response("Bad Request", { status: 400 });
    }

    await addPost(title, "", user.id);
    return new Response(null, {
      status: 303,
      headers: new Headers({
        location: "/",
      }),
    });
  },
};
