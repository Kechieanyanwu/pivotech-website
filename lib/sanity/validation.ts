import { z } from "zod";
import { defaultHomepage } from "../../content/homepage";

const text = (max: number) => z.string().trim().min(1).max(max);
export const homepageSchema = z.object({
  heroTitle: text(100), heroAccent: text(100), heroIntro: text(600),
  heroAudience: text(600), eventHeading: text(120), eventIntro: text(600),
});
export const annotationSchema = z.object({
  eventUid: text(150), city: text(80),
  timeZone: text(100).refine((zone) => {
    try { new Intl.DateTimeFormat("en", {timeZone:zone}); return true; } catch { return false; }
  }, "Use a valid IANA timezone"),
});
export const siteContentSchema = z.object({
  homepage: homepageSchema.nullable(),
  annotations: z.array(annotationSchema),
});
export function normalizeContent(value: unknown) {
  const parsed = siteContentSchema.parse(value);
  return { homepage: parsed.homepage ?? defaultHomepage, annotations: parsed.annotations };
}
