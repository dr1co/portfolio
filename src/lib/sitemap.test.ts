import { describe, expect, it } from "vitest";
import { labDemos } from "@/content/lab";
import { getCaseStudySlugs } from "@/content/projects";
import { sitemapEntries } from "./sitemap";

const site = "https://example.test";

describe("sitemapEntries", () => {
  const entries = sitemapEntries(site);
  const urls = entries.map((entry) => entry.url);

  it("lists every published page in both languages", () => {
    const [slug] = getCaseStudySlugs();
    const paths = [
      "/projects",
      `/projects/${slug}`,
      "/lab",
      labDemos[0].href,
      "/about",
    ];

    expect(urls).toContain(`${site}/`);
    expect(urls).toContain(`${site}/pt-br`);
    for (const path of paths) {
      expect(urls).toContain(`${site}${path}`);
      expect(urls).toContain(`${site}/pt-br${path}`);
    }
  });

  it("links each page to its translations with absolute URLs", () => {
    const entry = entries.find((item) => item.url === `${site}/pt-br/lab`);

    expect(entry?.alternates?.languages).toEqual({
      en: `${site}/lab`,
      "pt-BR": `${site}/pt-br/lab`,
      "x-default": `${site}/lab`,
    });
  });

  it("lists each URL once", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});
