import { isAdminSession } from "@/lib/member-admin/auth";
import { getMembers, getMemberEventResponses, getMemberInteractions, getMemberTags, getTalkSubmissions, type TalkSubmission } from "@/lib/member-admin/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) return Response.json({ error: "Sign in to view the member directory." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const [members, tags, interactions] = await Promise.all([getMembers(), getMemberTags(), getMemberInteractions()]);
    const responses = await getMemberEventResponses(members);
    let talks: TalkSubmission[] = [];
    let talksError = "";
    try {
      talks = await getTalkSubmissions(members);
    } catch {
      talksError = "Talk submissions are not available. Share the speaker response Sheet with the website service account as Viewer access.";
    }
    return Response.json({ members, tags, interactions, responses, talks, talksError }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The member list could not be loaded.";
    return Response.json({ error: message }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
