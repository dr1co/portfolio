import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PipelineSection } from "./pipeline-section";

describe("PipelineSection", () => {
  it("states up front that the walkthrough is simulated", () => {
    render(<PipelineSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "How my code reaches production",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not run or trigger a real pipeline/),
    ).toBeInTheDocument();
  });

  it("links to the Lab's Pipeline Explorer while the Lab is enabled", () => {
    render(<PipelineSection />);

    expect(
      screen.getByRole("link", {
        name: "Explore the real pipeline in the Lab",
      }),
    ).toHaveAttribute("href", "/lab/pipeline");
  });
});
