import { z } from "zod";
import { defaultHomepage } from "../../content/homepage";
import { defaultPillars, defaultSettings } from "../../content/community";

const text = (max: number) => z.string().trim().min(1).max(max);
export const homepageSchema = z.object({
  heroTitle: text(100),
  heroAccent: text(100),
  heroIntro: text(600),
  heroAudience: text(600),
  eventHeading: text(120),
  eventIntro: text(600),
  pillars: z
    .array(z.object({ verb: text(80), body: text(600) }))
    .max(8)
    .nullish()
    .transform((value) => value ?? defaultPillars),
  projectHeading: text(150)
    .nullish()
    .transform((value) => value ?? defaultHomepage.projectHeading),
});
const httpsUrl = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL");
export const settingsSchema = z.object({
  linkedin: httpsUrl,
  substack: httpsUrl,
  calendar: httpsUrl,
  stats: z.array(z.object({ number: text(20), label: text(100) })).max(8),
});
export const projectSchema = z
  .object({
    id: text(150),
    name: text(100),
    description: text(400),
    status: z.enum(["development", "launched"]),
    stealth: z.boolean(),
    href: httpsUrl.nullish(),
    image: z
      .object({
        url: httpsUrl.refine(
          (value) => new URL(value).hostname === "cdn.sanity.io",
        ),
        alt: text(200),
      })
      .nullish(),
  })
  .transform((project) =>
    project.stealth
      ? { ...project, name: "In stealth", href: null, image: null }
      : project,
  );
export const annotationSchema = z.object({
  eventUid: text(150),
  city: text(80),
  timeZone: text(100).refine((zone) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: zone });
      return true;
    } catch {
      return false;
    }
  }, "Use a valid IANA timezone"),
});
export const siteContentSchema = z.object({
  homepage: homepageSchema.nullable(),
  annotations: z.array(annotationSchema),
  settings: settingsSchema.nullish(),
  projects: z.array(projectSchema).optional(),
});
export function normalizeContent(value: unknown) {
  const parsed = siteContentSchema.parse(value);
  return {
    homepage: parsed.homepage ?? defaultHomepage,
    annotations: parsed.annotations,
    settings: parsed.settings ?? defaultSettings,
    projects: parsed.projects ?? [],
  };
}
