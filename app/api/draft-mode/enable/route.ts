import type { NextRequest } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity/client";

export async function GET(request: NextRequest) {
  if (!sanityClient || !process.env.SANITY_API_READ_TOKEN) {
    return new Response("Preview is not configured", { status: 503 });
  }
  const { GET: enable } = defineEnableDraftMode({
    client: sanityClient.withConfig({token:process.env.SANITY_API_READ_TOKEN}),
  });
  return enable(request);
}
