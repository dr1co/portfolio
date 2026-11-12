import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/locales";
import { caseStudyFile, getCaseStudySlugs, projects } from "./projects";

const dir = join(__dirname, "case-studies");
const mdxFiles = existsSync(dir)
  ? readdirSync(dir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
  : [];
const referenced = projects.flatMap((project) =>
  project.caseStudy ? [project.caseStudy] : [],
);
const expected = referenced.flatMap((name) =>
  locales.map((locale) => caseStudyFile(name, locale)),
);

describe("caseStudyFile", () => {
  it("uses the plain name in the default locale and a locale suffix otherwise", () => {
    expect(caseStudyFile("thesis", "en")).toBe("thesis");
    expect(caseStudyFile("thesis", "pt-br")).toBe("thesis.pt-br");
  });
});

describe("case-study registry", () => {
  it("has an MDX file in every language for every case study a project references", () => {
    expect(expected.filter((name) => !mdxFiles.includes(name))).toEqual([]);
  });

  it("has no MDX file that no project references", () => {
    expect(mdxFiles.filter((name) => !expected.includes(name))).toEqual([]);
  });

  it("publishes at least one case study, which Cache Components requires for static params", () => {
    expect(getCaseStudySlugs().length).toBeGreaterThan(0);
  });
});
