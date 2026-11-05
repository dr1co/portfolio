import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LabDemo } from "@/content/lab";
import { LabCard } from "./lab-card";

const demo: LabDemo = {
  slug: "pipeline",
  title: "Pipeline Explorer",
  summary: "Explore a real CI workflow.",
  objective: "See how jobs gate each other.",
  concepts: ["needs", "Conditions"],
  mode: "simulated",
  href: "/lab/pipeline",
  sourceUrl: "https://github.com/someone/repo/blob/main/ci.yml",
};

describe("LabCard", () => {
  it("links its title to the demo and labels it as simulated", () => {
    render(<LabCard demo={demo} />);

    expect(
      screen.getByRole("link", { name: "Pipeline Explorer" }),
    ).toHaveAttribute("href", "/lab/pipeline");
    expect(screen.getByText("Simulated")).toBeInTheDocument();
  });

  it("shows the learning objective and the concepts covered", () => {
    render(<LabCard demo={demo} />);

    expect(
      screen.getByText("See how jobs gate each other."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Concepts" }).querySelectorAll("li"),
    ).toHaveLength(2);
  });

  it("shows prerequisites only when there are some", () => {
    const { rerender } = render(<LabCard demo={demo} />);
    expect(screen.queryByText(/Prerequisites/)).not.toBeInTheDocument();

    rerender(<LabCard demo={{ ...demo, prerequisites: "Basic Git" }} />);
    expect(screen.getByText(/Basic Git/)).toBeInTheDocument();
  });

  it("links to the source only when the URL is publishable", () => {
    const { rerender } = render(<LabCard demo={demo} />);
    expect(screen.getByRole("link", { name: /Source/ })).toHaveAttribute(
      "href",
      demo.sourceUrl,
    );

    rerender(<LabCard demo={{ ...demo, sourceUrl: "" }} />);
    expect(
      screen.queryByRole("link", { name: /Source/ }),
    ).not.toBeInTheDocument();
  });
});
