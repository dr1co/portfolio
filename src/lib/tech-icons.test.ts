import { describe, expect, it } from "vitest";
import { techIcon } from "./tech-icons";

describe("techIcon", () => {
  it("keeps the brand colour in themes where it is readable on a tile", () => {
    expect(techIcon("git")).toMatchObject({
      light: "#F03C2E",
      dark: "#F03C2E",
    });
  });

  it("drops the brand colour in a theme where it would disappear", () => {
    const express = techIcon("express");
    expect(express?.light).toBe("#0A0A0A");
    expect(express?.dark).toBeUndefined();

    const linux = techIcon("linux");
    expect(linux?.light).toBeUndefined();
    expect(linux?.dark).toBe("#FCC624");
  });

  it("has no icon for technologies without a published logo", () => {
    expect(techIcon("aws")).toBeUndefined();
  });

  it("exposes the SVG path for a 24×24 viewBox", () => {
    expect(techIcon("python")?.path).toMatch(/^M/);
  });
});
