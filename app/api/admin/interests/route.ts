import { isAdminSession, isSameOriginRequest } from "@/lib/member-admin/auth";
import { appendMemberTag, type MemberTag } from "@/lib/member-admin/sheets";

export const runtime = "nodejs";

const allowedCategories = new Set(["Interest", "Role", "Strength", "Looking for"]);

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!(await isAdminSession())) return Response.json({ error: "Sign in to change member interests." }, { status: 401 });
  let body: Partial<MemberTag>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request body." }, { status: 400 }); }
  const personId = String(body.personId || "").trim();
  const tag = String(body.tag || "").trim();
  const category = String(body.category || "Interest").trim();
  const source = String(body.source || "manual").trim();
  const status = body.status === "rejected" ? "rejected" : "confirmed";
  const evidence = String(body.evidence || "").trim().slice(0, 500);
  if (!personId || !tag || tag.length > 64 || !allowedCategories.has(category)) {
    return Response.json({ error: "Choose a member, a tag under 65 characters, and a valid category." }, { status: 400 });
  }
  try {
    await appendMemberTag({ personId, tag, category, source, status, evidence });
    return Response.json({ saved: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The tag could not be saved.";
    return Response.json({ error: message }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
