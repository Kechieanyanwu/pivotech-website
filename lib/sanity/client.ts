import "server-only";
import { createClient } from "next-sanity";

export const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
export const sanityClient = sanityConfigured ? createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-09-01",
  useCdn: false,
  perspective: "published",
  timeout: 5000,
  maxRetries: 1,
}) : null;
