// Document https://fresh.deno.dev/docs/concepts/routes#handler-route

import { FreshContext, Handlers } from "$fresh/server.ts";
import { updateUserAvailabilities } from "../../utils/db.ts";
import { User } from "../../utils/types.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    if (!ctx.state.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const availability = body.availability;
    if (!availability) {
      return new Response("Bad Request", { status: 400 });
    }

    const user = ctx.state.user as User;
    updateUserAvailabilities(user.id, availability);

    return new Response("OK", { status: 200 });
  },
};
