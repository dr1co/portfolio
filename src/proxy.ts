import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudySlugs } from "@/content/projects";
import { defaultLocale, isLocale, stripLocale } from "@/i18n/locales";

const caseStudySlugs = new Set(getCaseStudySlugs());

const defaultPrefix = `/${defaultLocale}`;

/**
 * A path no route serves. Rewriting to it makes both `next start` and Vercel answer with the
 * not-found page and a real 404. Rewriting to "/404" doesn't: Vercel serves that static file with a 200.
 * It sits under a locale because any single segment would match `app/[lang]`.
 */
export const UNROUTED_PATH = `${defaultPrefix}/__unrouted`;

/** Image routes Next generates links to with the internal locale prefix (e.g. `/en/opengraph-image-1a2b`). */
const METADATA_IMAGE = /\/(opengraph-image|icon)[^/]*$/;

function unknownCaseStudy(path: string): boolean {
  const [, section, slug, rest] = path.split("/");
  return section === "projects" && !!slug && !rest && !caseStudySlugs.has(slug);
}

/**
 * Maps public URLs to the `app/[lang]` routes. English pages have no prefix, so `/projects` is served
 * by `/en/projects` and a typed `/en/...` redirects to the unprefixed URL. Other locales keep their prefix (`/pt-br/projects`). Unknown case-study slugs go
 * to the not-found page before rendering starts; otherwise the streamed shell would commit a 200.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    if (METADATA_IMAGE.test(pathname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultPrefix.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const [, first] = pathname.split("/");
  if (isLocale(first)) {
    return unknownCaseStudy(stripLocale(pathname))
      ? NextResponse.rewrite(new URL(UNROUTED_PATH, request.url))
      : NextResponse.next();
  }

  const target = unknownCaseStudy(pathname)
    ? UNROUTED_PATH
    : `${defaultPrefix}${pathname === "/" ? "" : pathname}${search}`;
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: "/((?!_next/|.*\\.[\\w]+$).*)",
};
