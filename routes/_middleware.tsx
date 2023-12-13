import { FreshContext, MiddlewareHandlerContext } from "$fresh/server.ts";
import { getSessionId } from "https://deno.land/x/deno_kv_oauth@v0.10.0/mod.ts";
export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  ctx.state.session = getSessionId(req);
  const resp = await ctx.next();
  return resp;
}
