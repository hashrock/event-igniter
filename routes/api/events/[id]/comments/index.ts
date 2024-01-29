// Document https://fresh.deno.dev/docs/concepts/routes#handler-route

import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  addComment,
  updateEventInterest,
  updateUserAvailabilities,
} from "../../../../../utils/db.ts";
import { User } from "../../../../../utils/types.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    if (!ctx.state.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const eventId = ctx.params.id;
    const formData = await req.formData();

    const user = ctx.state.user as User;

    const body = formData.get("body");

    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    await addComment(user, eventId, body.toString());

    // redirect
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/events/${eventId}`,
      },
    });
  },
};
