import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error("Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET before starting Studio. See docs/sanity-setup.md.");
export default defineConfig({
  name:"pivotech", title:"Pivotech", projectId, dataset,
  plugins:[
    structureTool({structure:S=>S.list().title("Website content").items([
      S.listItem().title("Homepage").id("homepage").child(S.document().schemaType("homepage").documentId("homepage")),
      ...S.documentTypeListItems().filter(item=>item.getId()!=="homepage"),
    ])}),
    presentationTool({previewUrl:{
      initial:process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3001",
      previewMode:{enable:"/api/draft-mode/enable"},
    }}),
  ],
  schema:{types:schemaTypes,templates:templates=>templates.filter(template=>template.schemaType!=="homepage")},
  document:{actions:(actions,context)=>context.schemaType==="homepage" ? actions.filter(action=>action.action!=="duplicate" && action.action!=="delete") : actions},
});
