import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-metadata";
import { sitemapEntries } from "@/lib/sitemap";

/** `/sitemap.xml`: every page in both languages. URLs use `NEXT_PUBLIC_SITE_URL`, or the local fallback until it's set. */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(siteOrigin);
}
