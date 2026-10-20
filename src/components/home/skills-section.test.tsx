import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SkillGroup } from "@/content/skills";
import { SkillsSection } from "./skills-section";

const groups: SkillGroup[] = [
  {
    id: "delivery",
    title: "Containers & Delivery",
    skills: [{ name: "Docker" }, { name: "Podman", learning: true }],
  },
  {
    id: "learning",
    title: "Learning Next",
    learning: true,
    skills: [{ name: "Kubernetes", learning: true }],
  },
];

describe("SkillsSection", () => {
  it("renders one h3 per group with its technologies", () => {
    render(<SkillsSection groups={groups} />);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Containers & Delivery", "Learning Next"]);
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("labels learning areas with visible text, at group and item level", () => {
    render(<SkillsSection groups={groups} />);

    const learningGroup = screen
      .getByRole("heading", { level: 3, name: "Learning Next" })
      .closest("article")!;
    expect(
      within(learningGroup).getByText("Currently learning"),
    ).toBeInTheDocument();

    const podman = screen.getByText("Podman").closest("li")!;
    expect(within(podman).getByText("learning")).toBeInTheDocument();
  });
});
