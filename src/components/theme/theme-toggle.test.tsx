import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

function renderToggle() {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("starts from the system theme and offers the opposite one", async () => {
    renderToggle();

    expect(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("switches theme on click and updates its label", async () => {
    renderToggle();

    await userEvent.click(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  it("restores a previously chosen theme", async () => {
    localStorage.setItem("theme", "dark");
    renderToggle();

    expect(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });
});
