import { describe, expect, it } from "vitest";
import { isLocale, stripLocale } from "./locales";

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
