// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/locales";
import { siteConfig } from "./site-config";

describe("résumé files", () => {
  it.each(locales)(
    "the %s résumé, when set, is a file in public/",
    (locale) => {
      const path = siteConfig.resume[locale];
      if (path === "") return;

      expect(path).toMatch(/^\/resume\/[\w.-]+\.pdf$/);
      expect(existsSync(join(process.cwd(), "public", path))).toBe(true);
    },
  );
});
