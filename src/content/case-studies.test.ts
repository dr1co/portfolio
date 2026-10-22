import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCaseStudySlugs, projects } from "./projects";

const dir = join(__dirname, "case-studies");
const mdxFiles = existsSync(dir)
  ? readdirSync(dir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
  : [];
const referenced = projects.flatMap((project) =>
  project.caseStudy ? [project.caseStudy] : [],
);

describe("case-study registry", () => {
  it("has an MDX file for every case study a project references", () => {
    expect(referenced.filter((name) => !mdxFiles.includes(name))).toEqual([]);
  });

  it("has no MDX file that no project references", () => {
    expect(mdxFiles.filter((name) => !referenced.includes(name))).toEqual([]);
  });

  it("publishes at least one case study, which Cache Components requires for static params", () => {
    expect(getCaseStudySlugs().length).toBeGreaterThan(0);
  });
});
