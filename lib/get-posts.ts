import "server-only";
import { unstable_cache } from "next/cache";
import { SUBSTACK } from "@/app/config";
import { latestPosts, parsePosts } from "./posts";

const readPosts = unstable_cache(async () => {
  const response = await fetch(`${SUBSTACK}/feed`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Substack returned ${response.status}`);
  return parsePosts(await response.text());
}, ["substack-posts-v1"], { revalidate: 3600, tags: ["posts"] });

export async function getLatestPosts() {
  try {
    return latestPosts(await readPosts());
  } catch {
    console.error("Substack feed unavailable; showing the publication link.");
    return [];
  }
}
