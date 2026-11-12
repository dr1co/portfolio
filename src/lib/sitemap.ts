import type { MetadataRoute } from "next";
import { labDemos } from "@/content/lab";
import { getCaseStudySlugs } from "@/content/projects";
import { locales, localizePath } from "@/i18n/locales";
import { languageAlternates } from "./canonical";
import { getEnabledRoutes } from "./links";
import { siteConfig } from "./site-config";

/** Every published page in every language, as absolute URLs under `siteUrl`, each linked to its translations. */
export function sitemapEntries(siteUrl: string): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, siteUrl).href;
  const routes = getEnabledRoutes(siteConfig.routes).map((route) => route.href);
  const paths = [
    ...routes,
    ...(routes.includes("/projects")
      ? getCaseStudySlugs().map((slug) => `/projects/${slug}`)
      : []),
    ...(routes.includes("/lab") ? labDemos.map((demo) => demo.href) : []),
  ];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([tag, href]) => [
        tag,
        absolute(href),
      ]),
    );
    return locales.map((locale) => ({
      url: absolute(localizePath(path, locale)),
      alternates: { languages },
    }));
  });
}
