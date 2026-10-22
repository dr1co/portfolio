import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavLink } from "./nav-link";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

describe("NavLink", () => {
  beforeEach(() => {
    navigation.pathname = "/";
  });

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

  it("marks the section link as current on its child pages, without claiming Home", () => {
    navigation.pathname = "/projects/some-case-study";
    render(
      <>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/projects">Projects</NavLink>
      </>,
    );

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
