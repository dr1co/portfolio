import type { Metadata } from "next";

/**
 * `alternates` for a page's own canonical URL, or undefined until `NEXT_PUBLIC_SITE_URL` is set.
 * Every page sets its own: metadata merges shallowly, so a canonical set higher up would leak into child pages.
 */
export function canonicalFor(
  path: string,
  siteUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): Metadata["alternates"] {
  return siteUrl ? { canonical: path } : undefined;
}
