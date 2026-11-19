import { describe, expect, it } from "vitest";
import { localize } from "./localize";

describe("localize", () => {
  it("resolves a localized text to the requested locale", () => {
    const text = { en: "Hello", "pt-br": "Olá" };

    expect(localize(text, "en")).toBe("Hello");
    expect(localize(text, "pt-br")).toBe("Olá");
  });

  it("resolves localized texts nested in objects and arrays, keeping everything else", () => {
    const source = {
      id: "push",
      title: { en: "Push", "pt-br": "Envio" },
      tags: [
        { en: "One", "pt-br": "Um" },
        { en: "Two", "pt-br": "Dois" },
      ],
      steps: [{ name: "Lint", optional: true }],
      failure: {
        job: "e2e",
        reason: { en: "A test fails.", "pt-br": "Um teste falha." },
      },
      count: 3,
      missing: undefined,
    };

    expect(localize(source, "pt-br")).toEqual({
      id: "push",
      title: "Envio",
      tags: ["Um", "Dois"],
      steps: [{ name: "Lint", optional: true }],
      failure: { job: "e2e", reason: "Um teste falha." },
      count: 3,
      missing: undefined,
    });
  });
});
