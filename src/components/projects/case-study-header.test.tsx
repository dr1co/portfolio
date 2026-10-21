import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/content/projects";
import { CaseStudyHeader } from "./case-study-header";

const project: Project = {
  slug: "django-project-template",
  title: "Django Project Template",
  summary: "One-line summary.",
  description: "A longer lead paragraph.",
  status: "available",
  technologies: ["django", "docker"],
  categories: ["templates"],
  group: "devops",
  featured: true,
  repositoryUrl: "https://github.com/someone/repo",
  lastUpdated: "2026-10-21",
};

describe("CaseStudyHeader", () => {
  it("shows the title as h1 with the description as lead, group, status and technologies", () => {
    render(<CaseStudyHeader project={project} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Django Project Template",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("A longer lead paragraph.")).toBeInTheDocument();
    expect(screen.getByText("DevOps & Delivery")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("falls back to the summary when there is no description", () => {
    render(
      <CaseStudyHeader project={{ ...project, description: undefined }} />,
    );

    expect(screen.getByText("One-line summary.")).toBeInTheDocument();
  });

  it("links to the source and shows the last update only when they exist", () => {
    const { rerender } = render(<CaseStudyHeader project={project} />);

    expect(screen.getByRole("link", { name: /^Source/ })).toHaveAttribute(
      "href",
      project.repositoryUrl,
    );
    expect(screen.queryByRole("link", { name: /^Live demo/ })).toBeNull();
    expect(screen.getByText(/Updated/).querySelector("time")).toHaveAttribute(
      "datetime",
      "2026-10-21",
    );

    rerender(
      <CaseStudyHeader
        project={{
          ...project,
          repositoryUrl: undefined,
          lastUpdated: undefined,
        }}
      />,
    );

    expect(screen.queryByRole("link", { name: /^Source/ })).toBeNull();
    expect(screen.queryByText(/Updated/)).toBeNull();
  });
});
