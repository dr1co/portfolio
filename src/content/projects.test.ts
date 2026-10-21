import { describe, expect, it } from "vitest";
import {
  getCaseStudySlugs,
  getFeaturedProjects,
  getProject,
  getProjectDirectory,
  type Project,
} from "./projects";

function project(overrides: Partial<Project>): Project {
  return {
    slug: "sample",
    title: "Sample",
    summary: "A sample project.",
    description: "A longer description.",
    status: "available",
    technologies: ["docker"],
    categories: ["templates"],
    group: "devops",
    featured: true,
    ...overrides,
  };
}

describe("getFeaturedProjects", () => {
  it("returns nothing when there are no projects", () => {
    expect(getFeaturedProjects([])).toEqual([]);
  });

  it("keeps featured projects that exist, skipping unfeatured and planned ones", () => {
    const result = getFeaturedProjects([
      project({ slug: "a" }),
      project({ slug: "b", featured: false }),
      project({ slug: "c", status: "planned" }),
      project({ slug: "d", status: "in-progress" }),
    ]);

    expect(result.map((p) => p.slug)).toEqual(["a", "d"]);
  });

  it("shows at most four projects", () => {
    const many = ["a", "b", "c", "d", "e"].map((slug) => project({ slug }));

    expect(getFeaturedProjects(many)).toHaveLength(4);
  });

  it("drops repository and demo links that are not publishable https URLs", () => {
    const [result] = getFeaturedProjects([
      project({ repositoryUrl: "TODO", demoUrl: "https://demo.example.com" }),
    ]);

    expect(result.repositoryUrl).toBeUndefined();
    expect(result.demoUrl).toBe("https://demo.example.com");
  });
});

describe("getProjectDirectory", () => {
  const slugsByGroup = (list: Project[]) =>
    getProjectDirectory(list).map(({ group, projects }) => [
      group.title,
      projects.map((p) => p.slug),
    ]);

  it("groups projects in the fixed group order and drops empty groups", () => {
    expect(
      slugsByGroup([
        project({ slug: "thesis", group: "ml" }),
        project({ slug: "template", group: "devops" }),
      ]),
    ).toEqual([
      ["DevOps & Delivery", ["template"]],
      ["Machine Learning", ["thesis"]],
    ]);
  });

  it("never publishes planned projects", () => {
    expect(
      slugsByGroup([
        project({ slug: "live" }),
        project({ slug: "idea", status: "planned", group: "ml" }),
      ]),
    ).toEqual([["DevOps & Delivery", ["live"]]]);
  });

  it("sorts each group by featured, then status, then title", () => {
    expect(
      slugsByGroup([
        project({ slug: "c", title: "Charlie", status: "in-progress" }),
        project({ slug: "b", title: "Bravo", featured: false }),
        project({ slug: "a", title: "Alpha", featured: false }),
        project({
          slug: "d",
          title: "Delta",
          status: "in-progress",
          featured: false,
        }),
      ]),
    ).toEqual([["DevOps & Delivery", ["c", "a", "b", "d"]]]);
  });

  it("drops links that are not publishable https URLs", () => {
    const [
      {
        projects: [result],
      },
    ] = getProjectDirectory([
      project({
        repositoryUrl: "http://insecure.example.com",
        demoUrl: "https://demo.example.com",
      }),
    ]);

    expect(result.repositoryUrl).toBeUndefined();
    expect(result.demoUrl).toBe("https://demo.example.com");
  });
});

describe("case-study lookup", () => {
  const list = [
    project({ slug: "with-story", caseStudy: "with-story" }),
    project({ slug: "card-only" }),
    project({ slug: "draft", caseStudy: "draft", status: "planned" }),
  ];

  it("lists the slugs of published projects that have a case study", () => {
    expect(getCaseStudySlugs(list)).toEqual(["with-story"]);
  });

  it("finds a project by slug only when it has a published case study", () => {
    expect(getProject("with-story", list)?.slug).toBe("with-story");
    expect(getProject("card-only", list)).toBeUndefined();
    expect(getProject("draft", list)).toBeUndefined();
    expect(getProject("missing", list)).toBeUndefined();
  });
});
