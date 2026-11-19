import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio as contrast } from "@/lib/contrast";
import { TILE_SURFACES } from "@/lib/tech-icons";

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

describe.each([
  ["light", ":root"],
  ["dark", '[data-theme="dark"]'],
] as const)("%s theme tokens", (theme, selector) => {
  const tokens = readTokens(selector);

  it("matches the tile surface used to check brand icon contrast", () => {
    expect(TILE_SURFACES[theme].toLowerCase()).toBe(
      tokens["surface-elevated"].toLowerCase(),
    );
  });

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
