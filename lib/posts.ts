import Parser from "rss-parser";

export type Post = { title: string; href: string; publishedAt: string };

export async function parsePosts(xml: string): Promise<Post[]> {
  const feed = await new Parser().parseString(xml);
  const posts = new Map<string, Post>();
  for (const item of feed.items) {
    const title = item.title?.replace(/<[^>]*>/g, "").trim();
    const date = new Date(item.isoDate ?? item.pubDate ?? "");
    if (!title || !item.link || !Number.isFinite(date.getTime())) continue;
    try {
      const url = new URL(item.link);
      if (url.protocol !== "https:" || url.hostname !== "pivotech.substack.com" || !url.pathname.startsWith("/p/")) continue;
      url.search = "";
      url.hash = "";
      url.pathname = url.pathname.replace(/\/$/, "");
      const post = { title, href: url.href, publishedAt: date.toISOString() };
      const previous = posts.get(post.href);
      if (!previous || post.publishedAt > previous.publishedAt) posts.set(post.href, post);
    } catch { /* Ignore malformed feed links. */ }
  }
  return [...posts.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function latestPosts(posts: Post[], now = new Date()): Post[] {
  return posts.filter((post) => Date.parse(post.publishedAt) <= now.getTime()).slice(0, 3);
}
