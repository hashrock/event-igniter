// Document https://fresh.deno.dev/docs/concepts/routes#handler-route

import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  updateEventInterest,
  updateUserAvailabilities,
} from "../../../../utils/db.ts";
import { User } from "../../../../utils/types.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    if (!ctx.state.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const eventId = ctx.params.id;
    const formData = await req.formData();
    const interest = formData.get("interest");
    if (!interest) {
      return new Response("Bad Request", { status: 400 });
    }

    const user = ctx.state.user as User;

    await updateEventInterest(user, eventId, Number(interest));

    // redirect
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/events/${eventId}`,
      },
    });
  },
};
