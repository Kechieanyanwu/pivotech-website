import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { sanityClient } from "./client";
import { normalizeContent } from "./validation";
import { defaultHomepage } from "@/content/homepage";
import { defaultSettings, defaultProjects } from "@/content/community";

const query = `{
  "homepage": *[_type == "homepage" && _id == "homepage"][0]{heroTitle,heroAccent,heroIntro,heroAudience,eventHeading,eventIntro,pillars[]{verb,body},projectHeading},
  "annotations": *[_type == "eventAnnotation"]{eventUid,city,timeZone},
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{linkedin,substack,calendar,stats[]{number,label}},
  "projects": *[_type == "communityProject" && visible != false] | order(displayOrder asc, _id asc){
    "id":_id, "name":select(stealth == true => "In stealth", publicName), description,status,"stealth":coalesce(stealth,false),
    "href":select(stealth == true => null, href),
    "image":select(stealth == true => null, defined(image.asset) => image{"url":asset->url,alt}, null)
  }
}`;
const readPublished = unstable_cache(
  async () => {
    const data = await sanityClient!.fetch(
      query,
      {},
      { perspective: "published", cache: "no-store" },
    );
    return normalizeContent(data);
  },
  [
    "sanity-site-v2",
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "",
  ],
  {
    revalidate: 3600,
    tags: ["site-content"],
  },
);

export const getSiteContent = cache(async () => {
  const fallback = {
    homepage: defaultHomepage,
    annotations: [],
    settings: defaultSettings,
    projects: defaultProjects,
    preview: false,
    available: true,
  };
  if (!sanityClient) return fallback;
  const preview = (await draftMode()).isEnabled;
  try {
    if (preview) {
      if (!process.env.SANITY_API_READ_TOKEN)
        throw new Error("Preview requires a read token");
      const data = await sanityClient
        .withConfig({ token: process.env.SANITY_API_READ_TOKEN })
        .fetch(
          query,
          {},
          {
            perspective: "drafts",
            cache: "no-store",
          },
        );
      return { ...normalizeContent(data), preview: true, available: true };
    }
    return { ...(await readPublished()), preview: false, available: true };
  } catch {
    console.error(
      "Sanity content unavailable or invalid; using local content.",
    );
    return { ...fallback, preview, available: false };
  }
});
