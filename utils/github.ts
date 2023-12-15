interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}
interface GitHubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "private" | "public";
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch user");
  }
  return await resp.json();
}

export async function getUserEmails(token: string): Promise<GitHubUserEmail[]> {
  const resp = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (!resp.ok) {
    console.error(await resp.text());
    throw new Error("Failed to fetch user emails");
  }
  return resp.json();
}
