import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavLink } from "./nav-link";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("NavLink", () => {
  it("marks the link for the current route as the current page", () => {
    render(
      <>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
      </>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("never marks in-page anchors as the current page", () => {
    render(<NavLink href="/#contact">Contact</NavLink>);

    expect(screen.getByRole("link", { name: "Contact" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
