import { describe, expect, it } from "vitest";
import { experienceLabel } from "./experience";

describe("experienceLabel", () => {
  it("counts whole years since the start year", () => {
    expect(experienceLabel(2022, 2026, "en")).toBe("4+ years");
  });

  it("uses the singular for one year", () => {
    expect(experienceLabel(2025, 2026, "en")).toBe("1+ year");
  });

  it("says less than a year when the start year is the current one", () => {
    expect(experienceLabel(2026, 2026, "en")).toBe("Less than a year");
  });
});
