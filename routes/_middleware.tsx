import { FreshContext, MiddlewareHandlerContext } from "$fresh/server.ts";
import { getSessionId } from "https://deno.land/x/deno_kv_oauth@v0.10.0/mod.ts";
import { getUserById, getUserBySession } from "../utils/db.ts";
import { User } from "../utils/types.ts";
export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  const session = await getSessionId(req);
  ctx.state.session = session;
  if (session) {
    const ghUser = await getUserBySession(session);
    if (ghUser) {
      ctx.state.user = await getUserById(String(ghUser.id));
    }
  }
  const resp = await ctx.next();
  return resp;
}

export interface LoginProps {
  session?: string;
  user?: User;
}
