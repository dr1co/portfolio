import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "globals.css"), "utf8");

function readTokens(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  if (!block) throw new Error(`No token block for ${selector}`);
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(
      ([, name, hex]) => [name, hex],
    ),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT_TOKENS = [
  "foreground",
  "muted",
  "accent",
  "accent-secondary",
  "warning",
  "error",
  "info",
];
const SURFACES = ["background", "surface", "surface-elevated"];

describe("contrast helper", () => {
  it("matches known WCAG reference ratios", () => {
    expect(contrast("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
    expect(contrast("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2);
  });
});

describe.each([
  ["light", ":root"],
  ["dark", '[data-theme="dark"]'],
])("%s theme tokens", (_, selector) => {
  const tokens = readTokens(selector);

  it.each(TEXT_TOKENS.flatMap((fg) => SURFACES.map((bg) => [fg, bg])))(
    "%s on %s meets WCAG AA text contrast (4.5:1)",
    (fg, bg) => {
      expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("accent-foreground on accent meets 4.5:1", () => {
    expect(
      contrast(tokens["accent-foreground"], tokens.accent),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
