import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/content/projects";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ProjectCard } from "./project-card";

const base: Project = {
  slug: "django-docker-template",
  title: "Django Docker Template",
  summary: "Containerized Django starter with a reproducible local setup.",
  description: "",
  status: "available",
  technologies: ["Django", "Docker", "PostgreSQL"],
  categories: ["templates"],
  featured: true,
};

describe("ProjectCard", () => {
  it("shows title, summary, technologies and a text status", () => {
    render(<ProjectCard project={base} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Django Docker Template" }),
    ).toBeInTheDocument();
    expect(screen.getByText(base.summary)).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("renders no links when none are available", () => {
    render(<ProjectCard project={base} />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("links to source, demo and case study only when each exists", () => {
    render(
      <ProjectCard
        project={{
          ...base,
          status: "in-progress",
          repositoryUrl: "https://github.com/someone/repo",
          demoUrl: "https://demo.example.com",
          caseStudy: "django-docker-template",
        }}
        showCaseStudy
      />,
    );

    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Source/ })).toHaveAttribute(
      "href",
      "https://github.com/someone/repo",
    );
    expect(screen.getByRole("link", { name: /^Live demo/ })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );
    expect(screen.getByRole("link", { name: "Case study" })).toHaveAttribute(
      "href",
      "/projects/django-docker-template",
    );
  });
});

describe("FeaturedProjects", () => {
  it("renders nothing when no project is featured", () => {
    const { container } = render(<FeaturedProjects projects={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a card per featured project under a section heading", () => {
    render(
      <FeaturedProjects
        projects={[
          base,
          { ...base, slug: "flask", title: "Flask API Template" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Featured projects" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});
