import { describe, expect, it } from "vitest";
import { isLocale, localizePath, stripLocale } from "./locales";

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("__unrouted")).toBe(false);
  });
});

describe("stripLocale", () => {
  it.each([
    ["/en", "/"],
    ["/en/", "/"],
    ["/en/lab/pipeline", "/lab/pipeline"],
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
