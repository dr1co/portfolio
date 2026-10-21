import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projectGroups, type Project } from "@/content/projects";
import { ProjectDirectory } from "./project-directory";

const project = (slug: string, title: string): Project => ({
  slug,
  title,
  summary: `${title} summary.`,
  status: "available",
  technologies: ["docker"],
  categories: [],
  group: "devops",
  featured: false,
});

describe("ProjectDirectory", () => {
  it("renders an h2 per group with that group's project cards", () => {
    render(
      <ProjectDirectory
        directory={[
          {
            group: projectGroups[0],
            projects: [project("a", "Alpha"), project("b", "Bravo")],
          },
          { group: projectGroups[2], projects: [project("c", "Charlie")] },
        ]}
      />,
    );

    const groups = screen.getAllByRole("region");
    expect(
      groups.map(
        (g) => within(g).getByRole("heading", { level: 2 }).textContent,
      ),
    ).toEqual(["DevOps & Delivery", "Machine Learning"]);
    expect(within(groups[0]).getAllByRole("article")).toHaveLength(2);
    expect(
      within(groups[1]).getByRole("heading", { level: 3 }),
    ).toHaveTextContent("Charlie");
  });
});
