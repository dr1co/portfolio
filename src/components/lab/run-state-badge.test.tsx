import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RunStateBadge } from "./run-state-badge";

describe("RunStateBadge", () => {
  it.each([
    ["pending", "Pending"],
    ["running", "Running"],
    ["passed", "Passed"],
    ["failed", "Failed"],
    ["skipped", "Skipped"],
  ] as const)("shows the %s state as text", (state, label) => {
    render(<RunStateBadge locale="en" state={state} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("spins the running icon unless told not to", () => {
    const { container, rerender } = render(
      <RunStateBadge locale="en" state="running" />,
    );
    expect(container.firstElementChild?.className).toContain("animate-spin");

    rerender(<RunStateBadge locale="en" state="running" spin={false} />);
    expect(container.firstElementChild?.className).not.toContain(
      "animate-spin",
    );
  });

  it("keeps the state icon decorative", () => {
    const { container } = render(<RunStateBadge locale="en" state="failed" />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
