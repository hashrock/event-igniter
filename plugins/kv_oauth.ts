import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import type { Plugin } from "$fresh/server.ts";
import { getUserById, setUserWithSession } from "../utils/db.ts";
import { getAuthenticatedUser, getUserEmails } from "../utils/github.ts";
import { User } from "../utils/types.ts";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig({
    scope: "user:email",
  }),
);

export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/signin",
      async handler(req) {
        return await signIn(req);
      },
    },
    {
      path: "/auth/oauth2callback",
      async handler(req) {
        const { response, tokens, sessionId } = await handleCallback(req);
        const ghUser = await getAuthenticatedUser(tokens!.accessToken);
        const emails = await getUserEmails(tokens!.accessToken);

        if (emails.length === 0) {
          throw new Error("No email found");
        }

        const primaryEmail = emails.find((e) => e.primary && e.verified);
        if (!primaryEmail) {
          throw new Error("No primary email found");
        }

        const userInDb = await getUserById(String(ghUser.id));

        if (userInDb) {
          await setUserWithSession({
            id: String(ghUser.id),
            login: ghUser.login,
            name: ghUser.name,
            avatarUrl: ghUser.avatar_url,
            role: userInDb.role,
            email: primaryEmail.email,
          }, sessionId);
        } else {
          const user: User = {
            id: String(ghUser.id),
            name: ghUser.name,
            avatarUrl: ghUser.avatar_url,
            login: ghUser.login,
            role: "guest",
          };
          await setUserWithSession(user, sessionId);
        }

        return response;
      },
    },
    {
      path: "/signout",
      async handler(req) {
        return await signOut(req);
      },
    },
    {
      path: "/protected",
      async handler(req) {
        return await getSessionId(req) === undefined
          ? new Response("Unauthorized", { status: 401 })
          : new Response("You are allowed");
      },
    },
  ],
} as Plugin;
