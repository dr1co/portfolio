import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNav } from "./mobile-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const items = [
  { href: "/", label: "Home" },
  { href: "/#contact", label: "Contact" },
];

describe("MobileNav", () => {
  it("opens and closes the menu from its toggle button", async () => {
    render(<MobileNav items={items} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Contact" })).toBeVisible();

    await userEvent.click(toggle);
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    render(<MobileNav items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.tab();

    await userEvent.keyboard("{Escape}");

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
