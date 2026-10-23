import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudySlugs } from "@/content/projects";

const caseStudySlugs = new Set(getCaseStudySlugs());

/**
 * A path no route serves. Rewriting to it makes both `next start` and Vercel answer with the
 * not-found page and a real 404. Rewriting to "/404" doesn't: Vercel serves that static file with a 200.
 */
export const UNROUTED_PATH = "/__unrouted";

/**
 * Sends unknown case-study slugs to the not-found page before rendering starts.
 * Without this, the streamed page shell commits a 200 status before `notFound()` runs.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (caseStudySlugs.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL(UNROUTED_PATH, request.url));
}

export const config = {
  matcher: "/projects/:slug",
};
