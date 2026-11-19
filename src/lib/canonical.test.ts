import { describe, expect, it } from "vitest";
import { canonicalFor, languageAlternates } from "./canonical";

const site = "https://example.test";

describe("languageAlternates", () => {
  it("maps every language tag, plus x-default, to the page's URL in that language", () => {
    expect(languageAlternates("/projects")).toEqual({
      en: "/projects",
      "pt-BR": "/pt-br/projects",
      "x-default": "/projects",
    });
    expect(languageAlternates("/")).toEqual({
      en: "/",
      "pt-BR": "/pt-br",
      "x-default": "/",
    });
  });
});

describe("canonicalFor", () => {
  it("points the canonical URL at the page in its own language, with its translations", () => {
    expect(canonicalFor("/projects", "en", site)).toEqual({
      canonical: "/projects",
      languages: languageAlternates("/projects"),
    });
    expect(canonicalFor("/projects", "pt-br", site)).toEqual({
      canonical: "/pt-br/projects",
      languages: languageAlternates("/projects"),
    });
  });

  it("sets no canonical URL while the production origin is unknown", () => {
    expect(canonicalFor("/projects", "en", undefined)).toBeUndefined();
    expect(canonicalFor("/projects", "pt-br", "")).toBeUndefined();
  });
});
