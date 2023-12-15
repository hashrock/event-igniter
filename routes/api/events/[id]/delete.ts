// Document https://fresh.deno.dev/docs/concepts/routes#handler-route

import { FreshContext, Handlers } from "$fresh/server.ts";
import { deletePost } from "../../../../utils/db.ts";
import { User } from "../../../../utils/types.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    if (!ctx.state.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const eventId = ctx.params.id;

    await deletePost(eventId);

    // redirect
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/`,
      },
    });
  },
};
