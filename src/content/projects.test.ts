import { describe, expect, it } from "vitest";
import { getFeaturedProjects, type Project } from "./projects";

function project(overrides: Partial<Project>): Project {
  return {
    slug: "sample",
    title: "Sample",
    summary: "A sample project.",
    description: "A longer description.",
    status: "available",
    technologies: ["Docker"],
    categories: ["templates"],
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
