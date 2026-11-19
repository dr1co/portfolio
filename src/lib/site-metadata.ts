import type { Metadata } from "next";
import { locales, ogLocales, type Locale } from "@/i18n/locales";
import { getSiteConfig } from "@/lib/site-config";

/** The production origin, or the local one until `NEXT_PUBLIC_SITE_URL` is set. */
export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Site-wide metadata in `locale`, shared by the root layout and the global 404 page. */
export function siteMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const defaultTitle = `${config.name} — ${config.descriptor}`;
  return {
    metadataBase: new URL(siteOrigin),
    title: { default: defaultTitle, template: `%s · ${config.name}` },
    description: config.tagline,
    robots: { index: allowIndexing, follow: allowIndexing },
    openGraph: {
      type: "website",
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => ogLocales[other]),
      siteName: config.wordmark,
      title: defaultTitle,
      description: config.tagline,
    },
    twitter: { card: "summary_large_image" },
  };
}
