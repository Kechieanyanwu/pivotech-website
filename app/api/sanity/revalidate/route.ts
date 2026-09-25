import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return new Response("Webhook is not configured", { status: 503 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );
    if (!isValidSignature)
      return new Response("Invalid signature", { status: 401 });
    if (
      !body?._type ||
      ![
        "homepage",
        "eventAnnotation",
        "siteSettings",
        "communityProject",
      ].includes(body._type)
    ) {
      return new Response("Unsupported content type", { status: 400 });
    }
    revalidateTag("site-content", { expire: 0 });
    return Response.json({ revalidated: true });
  } catch {
    return new Response("Invalid webhook request", { status: 400 });
  }
}
