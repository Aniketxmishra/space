export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface ActivityItem {
  id: string;
  type: "commit" | "pr" | "repo";
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

export async function getGithubRepos(username: string): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=public`,
    { headers, next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getGithubActivity(username: string): Promise<ActivityItem[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=20`,
    { headers, next: { revalidate: 1800 } }
  );
  if (!res.ok) return [];
  const events = await res.json();

  const colorMap: Record<string, string> = {
    PushEvent: "bg-violet-500",
    PullRequestEvent: "bg-cyan-500",
    CreateEvent: "bg-green-500",
    WatchEvent: "bg-yellow-500",
    ForkEvent: "bg-pink-500",
  };

  return events
    .filter((e: any) => ["PushEvent","PullRequestEvent","CreateEvent","WatchEvent","ForkEvent"].includes(e.type))
    .slice(0, 10)
    .map((e: any) => {
      const repo = e.repo?.name?.split("/")?.[1] || e.repo?.name;
      const time = new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      let title = repo;
      let subtitle = e.type.replace("Event", "");

      if (e.type === "PushEvent") {
        const msg = e.payload?.commits?.[0]?.message || "Pushed commits";
        title = msg.length > 60 ? msg.slice(0, 60) + "..." : msg;
        subtitle = `Pushed to ${repo}`;
      } else if (e.type === "PullRequestEvent") {
        title = e.payload?.pull_request?.title || "Pull Request";
        subtitle = `PR ${e.payload?.action} in ${repo}`;
      } else if (e.type === "CreateEvent") {
        title = `Created ${e.payload?.ref_type} in ${repo}`;
        subtitle = e.payload?.ref || repo;
      }

      return { id: e.id, type: e.type === "PushEvent" ? "commit" : e.type === "PullRequestEvent" ? "pr" : "repo", title, subtitle, time, color: colorMap[e.type] || "bg-white/20" };
    });
}
