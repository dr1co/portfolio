import { describe, expect, it } from "vitest";
import { localize } from "./localize";

describe("localize", () => {
  it("resolves a localized text to the requested locale", () => {
    expect(localize({ en: "Hello" }, "en")).toBe("Hello");
  });

  it("resolves localized texts nested in objects and arrays, keeping everything else", () => {
    const source = {
      id: "push",
      title: { en: "Push" },
      tags: [{ en: "One" }, { en: "Two" }],
      steps: [{ name: "Lint", optional: true }],
      failure: { job: "e2e", reason: { en: "A test fails." } },
      count: 3,
      missing: undefined,
    };

    expect(localize(source, "en")).toEqual({
      id: "push",
      title: "Push",
      tags: ["One", "Two"],
      steps: [{ name: "Lint", optional: true }],
      failure: { job: "e2e", reason: "A test fails." },
      count: 3,
      missing: undefined,
    });
  });
});
