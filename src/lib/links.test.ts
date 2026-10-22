import { describe, expect, it } from "vitest";
import {
  getContactLinks,
  getEnabledRoutes,
  getMissingLinks,
  isRouteEnabled,
} from "./links";

describe("getMissingLinks", () => {
  it("lists the profile links that are empty or invalid", () => {
    expect(
      getMissingLinks({
        github: "https://github.com/someone",
        linkedin: "",
        email: "oops",
      }),
    ).toEqual(["linkedin", "email"]);
  });
});

describe("getContactLinks", () => {
  it("returns nothing when no link is configured", () => {
    expect(getContactLinks({ github: "", linkedin: "", email: "" })).toEqual(
      [],
    );
  });

  it("keeps valid links in github, linkedin, email order with readable display text", () => {
    expect(
      getContactLinks({
        email: "me@example.com",
        linkedin: "https://www.linkedin.com/in/someone/",
        github: "https://github.com/someone",
      }),
    ).toEqual([
      {
        kind: "github",
        label: "GitHub",
        href: "https://github.com/someone",
        display: "github.com/someone",
      },
      {
        kind: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/someone/",
        display: "linkedin.com/in/someone",
      },
      {
        kind: "email",
        label: "Email",
        href: "mailto:me@example.com",
        display: "me@example.com",
      },
    ]);
  });

  it("drops malformed, non-https and placeholder values", () => {
    expect(
      getContactLinks({
        github: "http://github.com/someone",
        linkedin: "not a url",
        email: "nobody@",
      }),
    ).toEqual([]);
  });
});

describe("getEnabledRoutes", () => {
  it("returns only enabled routes, preserving order", () => {
    expect(
      getEnabledRoutes([
        { href: "/", label: "Home", enabled: true },
        { href: "/projects", label: "Projects", enabled: false },
        { href: "/about", label: "About", enabled: true },
      ]),
    ).toEqual([
      { href: "/", label: "Home", enabled: true },
      { href: "/about", label: "About", enabled: true },
    ]);
  });
});

describe("isRouteEnabled", () => {
  const routes = [
    { href: "/", label: "Home", enabled: true },
    { href: "/projects", label: "Projects", enabled: false },
  ] as const;

  it("tells whether a known route is switched on", () => {
    expect(isRouteEnabled(routes, "/")).toBe(true);
    expect(isRouteEnabled(routes, "/projects")).toBe(false);
    expect(isRouteEnabled(routes, "/lab")).toBe(false);
  });
});
