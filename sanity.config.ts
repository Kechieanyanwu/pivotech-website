import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset)
  throw new Error(
    "Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET before starting Studio. See docs/sanity-setup.md.",
  );
export default defineConfig({
  name: "pivotech",
  title: "Pivotech",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homepage")
              .child(
                S.document().schemaType("homepage").documentId("homepage"),
              ),
            S.listItem()
              .title("Links and community stats")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                !["homepage", "siteSettings"].includes(item.getId() ?? ""),
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial:
          process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (template) =>
          !["homepage", "siteSettings"].includes(template.schemaType),
      ),
  },
  document: {
    actions: (actions, context) =>
      ["homepage", "siteSettings"].includes(context.schemaType)
        ? actions.filter(
            (action) =>
              action.action !== "duplicate" && action.action !== "delete",
          )
        : actions,
  },
});
