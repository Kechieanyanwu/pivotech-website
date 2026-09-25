import test from "node:test";
import assert from "node:assert/strict";
import { normalizeContent, annotationSchema } from "../lib/sanity/validation";
import { defaultHomepage } from "../content/homepage";

test("missing homepage preserves approved copy and empty annotations remain valid",()=>{
  assert.deepEqual(normalizeContent({homepage:null,annotations:[]}),{homepage:defaultHomepage,annotations:[]});
});
test("invalid CMS copy cannot replace the published cache with broken content",()=>{
  assert.throws(()=>normalizeContent({homepage:{...defaultHomepage,heroTitle:""},annotations:[]}));
  assert.throws(()=>normalizeContent({homepage:defaultHomepage,annotations:[{eventUid:"event",city:"London",timeZone:"not-a-timezone"}]}));
});
test("event annotations never override source dates or registration URLs",()=>{
  assert.deepEqual(annotationSchema.parse({eventUid:"event",city:"Lagos",timeZone:"Africa/Lagos",start:"wrong",href:"javascript:bad"}),{eventUid:"event",city:"Lagos",timeZone:"Africa/Lagos"});
});
