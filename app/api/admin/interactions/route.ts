import { isAdminSession, isSameOriginRequest } from "@/lib/member-admin/auth";
import {
  appendMemberInteraction,
  type MemberInteraction,
} from "@/lib/member-admin/sheets";

export const runtime = "nodejs";

const allowedTypes = new Set(["Note", "Introduction", "Follow-up"]);

export async function POST(request: Request) {
  if (!isSameOriginRequest(request))
    return Response.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!(await isAdminSession()))
    return Response.json(
      { error: "Sign in to add a member interaction." },
      { status: 401 },
    );
  let body: Partial<MemberInteraction>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const personId = String(body.personId || "").trim();
  const type = String(body.type || "Note").trim();
  const summary = String(body.summary || "")
    .trim()
    .slice(0, 2000);
  const date = String(body.date || "").trim();
  const followUpDate = String(body.followUpDate || "").trim();
  const followUpStatus =
    body.followUpStatus === "Done" ? "Done" : followUpDate ? "Pending" : "";
  if (
    !personId ||
    !allowedTypes.has(type) ||
    !summary ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    (followUpDate && !/^\d{4}-\d{2}-\d{2}$/.test(followUpDate))
  ) {
    return Response.json(
      {
        error:
          "Choose an interaction type, add a short note, and check the dates.",
      },
      { status: 400 },
    );
  }
  try {
    await appendMemberInteraction({
      personId,
      type: type as MemberInteraction["type"],
      summary,
      date,
      followUpDate,
      followUpStatus,
    });
    return Response.json(
      { saved: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.log(error); //test
    const message =
      error instanceof Error
        ? error.message
        : "The interaction could not be saved.";
    return Response.json(
      { error: message },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
