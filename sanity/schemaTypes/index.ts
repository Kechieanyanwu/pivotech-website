import { defineField, defineType } from "sanity";
import { defaultHomepage } from "../../content/homepage";

const copyField = (name: string, title: string, max: number) => defineField({
  name, title, type: max > 200 ? "text" : "string", validation: rule => rule.required().max(max),
});
export const schemaTypes = [
  defineType({
    name:"homepage", title:"Homepage", type:"document", initialValue:defaultHomepage,
    fields:[
      copyField("heroTitle","Headline",100), copyField("heroAccent","Headline (italic)",100),
      copyField("heroIntro","Introduction",600), copyField("heroAudience","Who we bring together",600),
      copyField("eventHeading","Conversations heading",120), copyField("eventIntro","Conversations introduction",600),
    ],
    preview:{prepare:()=>({title:"Homepage"})},
  }),
  defineType({
    name:"eventAnnotation", title:"Event city and timezone", type:"document",
    description:"Luma owns dates, titles, registration links and cancellation. Add only the missing location labels here.",
    fields:[
      defineField({name:"eventUid",title:"Luma feed UID",type:"string",description:"Copy the complete UID from the calendar feed, including @events.lu.ma.",validation:r=>r.required().max(150)}),
      copyField("city","City label",80),
      defineField({name:"timeZone",title:"IANA timezone",type:"string",description:"For example Africa/Lagos or Europe/London.",validation:r=>r.required().custom(value=>{
        try { if(!value) return "Timezone is required"; new Intl.DateTimeFormat("en",{timeZone:value}); return true; } catch { return "Use a valid IANA timezone"; }
      })}),
    ],
    preview:{select:{title:"city",subtitle:"eventUid"}},
  }),
];
