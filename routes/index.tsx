import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { defineRoute } from "$fresh/server.ts";
import { getAuthenticatedUser } from "../utils/github.ts";
import { getUserById, getUserBySession } from "../utils/db.ts";

interface Props {
  session: string;
}

export default defineRoute<Props>(async (req, ctx) => {
  let user = null;
  const session = await ctx.state.session;
  if (session) {
    const ghUser = await getUserBySession(session);
    if (ghUser) {
      user = await getUserById(String(ghUser.id));
    }
  }

  return (
    <div class="px-4 py-8 mx-auto max-w-7xl">
      {user === null && (
        <a href="/signin">
          Sign in with GitHub
        </a>
      )}

      {user !== null && (
        <div>
          <div class="flex items-center">
            <img
              class="w-8 h-8 mr-2 rounded-full"
              src={user.avatarUrl}
              alt={user.name}
            />
            <span class="text-lg font-bold">{user.name}</span>
          </div>
        </div>
      )}
    </div>
  );
});
