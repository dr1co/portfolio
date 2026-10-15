import { describe, expect, it } from "vitest";
import { resolveHeroCtas } from "./hero-ctas";

const github = "https://github.com/someone";

describe("resolveHeroCtas", () => {
  it("points the primary action at featured projects when there are any", () => {
    expect(
      resolveHeroCtas({ featuredCount: 2, githubUrl: github, hasContact: true })
        .primary,
    ).toEqual({
      label: "Explore Projects",
      href: "#projects",
    });
  });

  it("falls back to GitHub when no project is featured", () => {
    expect(
      resolveHeroCtas({
        featuredCount: 0,
        githubUrl: github,
        hasContact: false,
      }).primary,
    ).toEqual({
      label: "Open GitHub",
      href: github,
      external: true,
    });
  });

  it("falls back to the pipeline when neither projects nor GitHub exist", () => {
    expect(
      resolveHeroCtas({ featuredCount: 0, githubUrl: "", hasContact: false })
        .primary,
    ).toEqual({
      label: "See the pipeline",
      href: "#pipeline",
    });
  });

  it("offers contact as the secondary action only when a contact link exists", () => {
    const base = { featuredCount: 0, githubUrl: "" };
    expect(resolveHeroCtas({ ...base, hasContact: true }).secondary).toEqual({
      label: "Get in touch",
      href: "#contact",
    });
    expect(
      resolveHeroCtas({ ...base, hasContact: false }).secondary,
    ).toBeUndefined();
  });
});
