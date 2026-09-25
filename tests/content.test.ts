import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeContent,
  annotationSchema,
  projectSchema,
  settingsSchema,
} from "../lib/sanity/validation";
import { defaultHomepage } from "../content/homepage";
import { defaultSettings } from "../content/community";

test("missing homepage preserves approved copy and empty annotations remain valid", () => {
  assert.deepEqual(normalizeContent({ homepage: null, annotations: [] }), {
    homepage: defaultHomepage,
    annotations: [],
    settings: defaultSettings,
    projects: [],
  });
});

test("stealth projects cannot leak names, links or images in rendered content", () => {
  const project = projectSchema.parse({
    id: "test",
    name: "Hidden name",
    description: "Public description",
    status: "development",
    stealth: true,
    href: "https://example.com",
    image: {
      url: "https://cdn.sanity.io/images/test/production/test.png",
      alt: "An image",
    },
  });
  assert.equal(project.name, "In stealth");
  assert.equal(project.href, null);
  assert.equal(project.image, null);
});
test("explicitly empty projects and stats stay empty; unsafe setting links fail validation", () => {
  const content = normalizeContent({
    homepage: defaultHomepage,
    annotations: [],
    settings: { ...defaultSettings, stats: [] },
    projects: [],
  });
  assert.deepEqual(content.projects, []);
  assert.deepEqual(content.settings.stats, []);
  assert.equal(
    settingsSchema.safeParse({
      ...defaultSettings,
      linkedin: "javascript:alert(1)",
    }).success,
    false,
  );
});
test("invalid CMS copy cannot replace the published cache with broken content", () => {
  assert.throws(() =>
    normalizeContent({
      homepage: { ...defaultHomepage, heroTitle: "" },
      annotations: [],
    }),
  );
  assert.throws(() =>
    normalizeContent({
      homepage: defaultHomepage,
      annotations: [
        { eventUid: "event", city: "London", timeZone: "not-a-timezone" },
      ],
    }),
  );
});
test("event annotations never override source dates or registration URLs", () => {
  assert.deepEqual(
    annotationSchema.parse({
      eventUid: "event",
      city: "Lagos",
      timeZone: "Africa/Lagos",
      start: "wrong",
      href: "javascript:bad",
    }),
    { eventUid: "event", city: "Lagos", timeZone: "Africa/Lagos" },
  );
});
