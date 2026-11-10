import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SkillGroup } from "@/content/skills";
import { SkillGrid } from "./skills-section";

const groups: SkillGroup[] = [
  {
    id: "delivery",
    title: "Containers & Delivery",
    skills: [
      { tech: "docker", since: 2022, note: "Including Docker Compose" },
      { tech: "redis", since: 2026 },
    ],
  },
  {
    id: "learning",
    title: "Learning Next",
    learning: true,
    skills: [{ tech: "kubernetes" }, { tech: "aws" }],
  },
];

describe("SkillGrid", () => {
  it("renders one h3 per group", () => {
    render(<SkillGrid groups={groups} year={2026} />);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Containers & Delivery", "Learning Next"]);
  });

  it("names each technology's icon and describes it with experience, notes and projects", () => {
    render(<SkillGrid groups={groups} year={2026} />);

    const docker = screen.getByRole("img", { name: "Docker" });
    expect(docker).toHaveAccessibleDescription(/4\+ years/);
    expect(docker).toHaveAccessibleDescription(/Including Docker Compose/);
    expect(docker).toHaveAccessibleDescription(/Used in:/);

    const redis = screen.getByRole("img", { name: "Redis" });
    expect(redis).toHaveAccessibleDescription(/Less than a year/);
    expect(redis).not.toHaveAccessibleDescription(/Used in:/);
  });

  it("labels learning areas with visible text instead of experience", () => {
    render(<SkillGrid groups={groups} year={2026} />);

    const learningGroup = screen
      .getByRole("heading", { level: 3, name: "Learning Next" })
      .closest("article")!;
    expect(
      within(learningGroup).getByText("Currently learning", {
        selector: ":not([role=tooltip] *)",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Kubernetes" }),
    ).toHaveAccessibleDescription(/Currently learning/);
  });

  it("falls back to the name as text when a technology has no logo", () => {
    render(<SkillGrid groups={groups} year={2026} />);

    expect(screen.getByRole("img", { name: "AWS" })).toHaveTextContent("AWS");
  });

  it("makes every icon reachable by keyboard", () => {
    render(<SkillGrid groups={groups} year={2026} />);

    for (const icon of screen.getAllByRole("img")) {
      expect(icon).toHaveAttribute("tabindex", "0");
    }
  });
});
