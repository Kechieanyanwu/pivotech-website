import { adminCookie, clearedAdminCookie, createAdminSessionToken, isSameOriginRequest, passwordMatches } from "@/lib/member-admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!process.env.MEMBERS_ADMIN_PASSWORD || !process.env.MEMBERS_SESSION_SECRET) {
    return Response.json({ error: "Member admin sign-in is not configured yet." }, { status: 503 });
  }
  let body: { password?: string };
  try { body = await request.json(); } catch { return Response.json({ error: "Enter the admin password." }, { status: 400 }); }
  if (!passwordMatches(String(body.password || ""))) return Response.json({ error: "That password did not match." }, { status: 401 });
  const response = Response.json({ signedIn: true });
  response.headers.set("Set-Cookie", adminCookie(createAdminSessionToken()));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  const response = Response.json({ signedOut: true });
  response.headers.set("Set-Cookie", clearedAdminCookie());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
