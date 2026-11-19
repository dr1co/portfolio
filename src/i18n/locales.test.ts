import { describe, expect, it } from "vitest";
import { isLocale, localizePath, stripLocale } from "./locales";

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("pt-br")).toBe(true);
    expect(isLocale("pt")).toBe(false);
    expect(isLocale("__unrouted")).toBe(false);
  });
});

describe("stripLocale", () => {
  it.each([
    ["/en", "/"],
    ["/en/", "/"],
    ["/en/lab/pipeline", "/lab/pipeline"],
    ["/pt-br", "/"],
    ["/pt-br/projects/x", "/projects/x"],
    ["/lab", "/lab"],
    ["/", "/"],
    ["/english", "/english"],
  ])("turns %s into %s", (pathname, path) => {
    expect(stripLocale(pathname)).toBe(path);
  });
});

describe("localizePath", () => {
  it.each(["/", "/projects", "/#contact", "#contact", "/lab?x=1"])(
    "leaves %s unprefixed for the default locale",
    (href) => {
      expect(localizePath(href, "en")).toBe(href);
    },
  );
});

describe("localizePath in another locale", () => {
  it.each([
    ["/", "/pt-br"],
    ["/projects", "/pt-br/projects"],
    ["/#contact", "/pt-br#contact"],
    ["/lab?x=1", "/pt-br/lab?x=1"],
    ["#contact", "#contact"],
    ["https://github.com/x", "https://github.com/x"],
    ["mailto:me@example.com", "mailto:me@example.com"],
  ])("turns %s into %s", (href, localized) => {
    expect(localizePath(href, "pt-br")).toBe(localized);
  });
});
