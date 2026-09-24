import "server-only";
import { unstable_cache } from "next/cache";
import { LUMA_FEED } from "@/app/config";
import { fallbackEvents, parseEvents, upcomingEvents } from "./events";

// This app uses Next's caching model without Cache Components. Cache only
// validated data; a failed background refresh retains the last successful feed.
const readEvents = unstable_cache(async () => {
  const response = await fetch(LUMA_FEED, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Luma returned ${response.status}`);
  return parseEvents(await response.text());
}, ["luma-events-v1"], { revalidate: 43200, tags: ["events"] });

export async function getUpcomingEvents() {
  try {
    return upcomingEvents(await readEvents());
  } catch {
    console.error("Luma feed unavailable; using the dated event fallback.");
    // These launch records expire normally. A valid empty feed never falls back.
    return upcomingEvents(fallbackEvents);
  }
}
