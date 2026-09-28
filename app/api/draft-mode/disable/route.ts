import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { perspectiveCookieName, variantCookieName } from "@sanity/preview-url-secret/constants";

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const response = NextResponse.redirect(new URL("/", request.url));
  // next-sanity marks preview sessions opened in a cross-site Studio iframe.
  // Those cookies must also be expired with Partitioned to clear that session.
  if (request.cookies.has("sanity-preview-partitioned")) {
    for (const name of ["__prerender_bypass", "sanity-preview-partitioned", perspectiveCookieName, variantCookieName]) {
      response.cookies.set(name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: "none",
        partitioned: true,
      });
    }
  }
  return response;
}
