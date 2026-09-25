import { defineField, defineType } from "sanity";
import { defaultHomepage } from "../../content/homepage";
import { defaultSettings, defaultPillars } from "../../content/community";

const copyField = (name: string, title: string, max: number) =>
  defineField({
    name,
    title,
    type: max > 200 ? "text" : "string",
    validation: (rule) => rule.required().max(max),
  });
export const schemaTypes = [
  defineType({
    name: "homepage",
    title: "Homepage",
    type: "document",
    initialValue: {
      ...defaultHomepage,
      pillars: defaultPillars.map((p, i) => ({ ...p, _key: `pillar-${i}` })),
    },
    fields: [
      copyField("heroTitle", "Headline", 100),
      copyField("heroAccent", "Headline (italic)", 100),
      copyField("heroIntro", "Introduction", 600),
      copyField("heroAudience", "Who we bring together", 600),
      copyField("eventIntro", "Conversations introduction", 600),
      copyField("projectHeading", "Community projects heading", 150),
      defineField({
        name: "pillars",
        title: "Ecosystem descriptions",
        type: "array",
        initialValue: defaultPillars.map((p, i) => ({
          ...p,
          _key: `pillar-${i}`,
        })),
        validation: (r) => r.max(8),
        of: [
          {
            type: "object",
            fields: [
              copyField("verb", "Name", 80),
              copyField("body", "Description", 600),
            ],
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Homepage" }) },
  }),
  defineType({
    name: "eventAnnotation",
    title: "Event city and timezone",
    type: "document",
    description:
      "Luma owns dates, titles, registration links and cancellation. Add only the missing location labels here.",
    fields: [
      defineField({
        name: "eventUid",
        title: "Luma feed UID",
        type: "string",
        description:
          "Copy the complete UID from the calendar feed, including @events.lu.ma.",
        validation: (r) => r.required().max(150),
      }),
      copyField("city", "City label", 80),
      defineField({
        name: "timeZone",
        title: "IANA timezone",
        type: "string",
        description: "For example Africa/Lagos or Europe/London.",
        validation: (r) =>
          r.required().custom((value) => {
            try {
              if (!value) return "Timezone is required";
              new Intl.DateTimeFormat("en", { timeZone: value });
              return true;
            } catch {
              return "Use a valid IANA timezone";
            }
          }),
      }),
    ],
    preview: { select: { title: "city", subtitle: "eventUid" } },
  }),
  defineType({
    name: "siteSettings",
    title: "Links and community stats",
    type: "document",
    initialValue: {
      ...defaultSettings,
      stats: defaultSettings.stats.map((s, i) => ({ ...s, _key: `stat-${i}` })),
    },
    fields: [
      ...["linkedin", "substack", "calendar"].map((name) =>
        defineField({
          name,
          title: `${name.charAt(0).toUpperCase() + name.slice(1)} URL`,
          type: "url",
          validation: (r) => r.required().uri({ scheme: ["https"] }),
        }),
      ),
      defineField({
        name: "stats",
        title: "Community stats",
        type: "array",
        validation: (r) => r.required().max(8),
        of: [
          {
            type: "object",
            fields: [
              copyField("number", "Value", 20),
              copyField("label", "Label", 100),
              defineField({
                name: "reviewedAt",
                title: "Last reviewed",
                type: "date",
                description:
                  "Editorial reminder; not displayed on the website.",
              }),
            ],
          },
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Links and community stats" }) },
  }),
  defineType({
    name: "communityProject",
    title: "Community project",
    type: "document",
    description:
      "Only store information approved for public display. This dataset is public; do not enter confidential project names, plans or assets.",
    initialValue: {
      visible: true,
      stealth: true,
      status: "development",
      displayOrder: 0,
    },
    fields: [
      defineField({
        name: "publicName",
        title: "Public project title",
        type: "string",
        description:
          "Use In stealth if the name is not public. Never enter a secret name here.",
        validation: (r) => r.required().max(100),
      }),
      copyField("description", "Public description", 400),
      defineField({
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
            { title: "In development", value: "development" },
            { title: "Launched", value: "launched" },
          ],
        },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "stealth",
        title: "Show as In stealth",
        type: "boolean",
        description:
          "Hides name, image and project link from the website. Not a privacy control for the dataset itself.",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "visible",
        title: "Show on homepage",
        type: "boolean",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "displayOrder",
        title: "Display order",
        type: "number",
        description: "Lower values appear first.",
        validation: (r) => r.required().integer().min(0),
      }),
      defineField({
        name: "href",
        title: "Public project URL",
        type: "url",
        validation: (r) => r.uri({ scheme: ["https"] }),
      }),
      defineField({
        name: "image",
        title: "Public project image",
        type: "image",
        fields: [
          defineField({
            name: "alt",
            title: "Image description",
            type: "string",
            validation: (r) => r.required().max(200),
          }),
        ],
      }),
    ],
    preview: {
      select: { title: "publicName", subtitle: "description", media: "image" },
    },
  }),
];
