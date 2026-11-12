import type { Metadata } from "next";
import type { Locale } from "@/i18n/locales";
import { getSiteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Site-wide metadata in `locale`, shared by the root layout and the global 404 page. */
export function siteMetadata(locale: Locale): Metadata {
  const config = getSiteConfig(locale);
  const defaultTitle = `${config.name} — ${config.descriptor}`;
  return {
    metadataBase: new URL(siteUrl || "http://localhost:3000"),
    title: { default: defaultTitle, template: `%s · ${config.name}` },
    description: config.tagline,
    robots: { index: allowIndexing, follow: allowIndexing },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: config.wordmark,
      title: defaultTitle,
      description: config.tagline,
    },
    twitter: { card: "summary_large_image" },
  };
}
