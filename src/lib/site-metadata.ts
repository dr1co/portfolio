import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const defaultTitle = `${siteConfig.name} — ${siteConfig.descriptor}`;

/** Site-wide metadata shared by the root layout and the global 404 page. */
export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: { default: defaultTitle, template: `%s · ${siteConfig.name}` },
  description: siteConfig.tagline,
  robots: { index: allowIndexing, follow: allowIndexing },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.wordmark,
    title: defaultTitle,
    description: siteConfig.tagline,
  },
  twitter: { card: "summary_large_image" },
};
