import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "./about-section";

describe("AboutSection", () => {
  it("shows the whoami workflow under its own heading", () => {
    render(<AboutSection locale="en" age={30} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "A little about me" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "whoami workflow" }),
    ).toBeInTheDocument();
  });

  it("links to the full about page", () => {
    render(<AboutSection locale="en" age={30} />);

    expect(
      screen.getByRole("link", { name: "Read the full story" }),
    ).toHaveAttribute("href", "/about");
  });
});
