import { describe, expect, it } from "vitest";
import { ageOn } from "./age";
import { siteConfig } from "./site-config";

describe("ageOn", () => {
  it("doesn't count the birthday yet during the birth month", () => {
    expect(ageOn("1990-06", new Date(2020, 5, 30))).toBe(29);
  });

  it("counts the birthday from the 1st of the following month", () => {
    expect(ageOn("1990-06", new Date(2020, 6, 1))).toBe(30);
  });

  it("doesn't count the birthday before the birth month", () => {
    expect(ageOn("1990-06", new Date(2020, 0, 15))).toBe(29);
  });

  it("rolls a December birthday over on 1 January", () => {
    expect(ageOn("1990-12", new Date(2020, 11, 31))).toBe(29);
    expect(ageOn("1990-12", new Date(2021, 0, 1))).toBe(30);
  });
});

describe("site config birth month", () => {
  it("is a year and month, never a full date", () => {
    expect(siteConfig.birthMonth).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });
});
