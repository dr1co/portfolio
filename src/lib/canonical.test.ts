import { describe, expect, it } from "vitest";
import { canonicalFor } from "./canonical";

describe("canonicalFor", () => {
  it("points the canonical URL at the given path when the site URL is known", () => {
    expect(canonicalFor("/projects", "https://example.test")).toEqual({
      canonical: "/projects",
    });
  });

  it("sets no canonical URL while the production origin is unknown", () => {
    expect(canonicalFor("/projects", undefined)).toBeUndefined();
    expect(canonicalFor("/projects", "")).toBeUndefined();
  });
});
