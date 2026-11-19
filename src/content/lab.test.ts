import { describe, expect, it } from "vitest";
import { isHttpsUrl } from "@/lib/links";
import { labDemos } from "./lab";

describe("lab demos", () => {
  it("has unique slugs", () => {
    const slugs = labDemos.map((demo) => demo.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(labDemos.map((demo) => [demo.slug, demo] as const))(
    "%s states what it teaches and links to its own Lab page",
    (slug, demo) => {
      expect(demo.objective.en).not.toBe("");
      expect(demo.concepts.length).toBeGreaterThan(0);
      expect(demo.href).toBe(`/lab/${slug}`);
    },
  );

  it.each(labDemos.map((demo) => [demo.slug, demo] as const))(
    "%s links to publishable source material only",
    (_, demo) => {
      if (demo.sourceUrl !== undefined) {
        expect(isHttpsUrl(demo.sourceUrl)).toBe(true);
      }
    },
  );
});
