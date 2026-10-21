import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudySlugs } from "@/content/projects";

const caseStudySlugs = new Set(getCaseStudySlugs());

/**
 * Sends unknown case-study slugs to the static not-found page before rendering starts.
 * Without this, the streamed page shell commits a 200 status before `notFound()` runs.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (caseStudySlugs.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/404", request.url));
}

export const config = {
  matcher: "/projects/:slug",
};
