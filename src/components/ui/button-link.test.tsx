import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "./button-link";

describe("ButtonLink", () => {
  it("opens external links in a new tab safely and says so to screen readers", () => {
    render(
      <ButtonLink href="https://github.com/someone" external>
        Open GitHub
      </ButtonLink>,
    );

    const link = screen.getByRole("link", {
      name: /^Open GitHub\s*\(opens in a new tab\)$/,
    });
    expect(link).toHaveAttribute("href", "https://github.com/someone");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps internal and in-page links in the same tab", () => {
    render(<ButtonLink href="#pipeline">See the pipeline</ButtonLink>);

    const link = screen.getByRole("link", { name: "See the pipeline" });
    expect(link).toHaveAttribute("href", "#pipeline");
    expect(link).not.toHaveAttribute("target");
  });
});
