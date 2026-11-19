import { describe, expect, it } from "vitest";
import { isHttpsUrl } from "@/lib/links";
import { about } from "./about";
import { getCaseStudySlugs } from "./projects";
import { skillGroups } from "./skills";

describe("about content", () => {
  it("runs the whoami workflow's jobs in order", () => {
    expect(about.jobs.map((job) => job.id)).toEqual([
      "whoami",
      "experience",
      "education",
      "learning",
    ]);
  });

  it.each(about.jobs.map((job) => [job.id, job] as const))(
    "%s has a summary for the job strip",
    (_, job) => {
      expect(job.summary.length).toBeGreaterThan(0);
      for (const line of job.summary) expect(line.en).not.toBe("");
    },
  );

  it("links education only to published case studies", () => {
    const slugs = getCaseStudySlugs();
    for (const item of about.education) {
      if (item.href !== undefined) {
        expect(slugs).toContain(item.href.replace("/projects/", ""));
      }
    }
  });

  it("links facts to publishable URLs only", () => {
    for (const fact of about.facts) {
      if (fact.href !== undefined) expect(isHttpsUrl(fact.href)).toBe(true);
    }
  });

  it("learns what the skills section says is being learned, in the same order", () => {
    const learning = skillGroups.find((group) => group.learning);
    expect(about.learning.map((item) => item.tech)).toEqual(
      learning?.skills.map((skill) => skill.tech),
    );
  });

  it("lists achievements newest first", () => {
    const years = about.achievements.map((item) => item.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });
});
