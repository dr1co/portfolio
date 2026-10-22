import { describe, expect, it } from "vitest";
import { pipelineStages } from "./pipeline";
import { skillGroups } from "./skills";

describe("pipeline content", () => {
  it("walks the five delivery stages in order", () => {
    expect(pipelineStages.map((stage) => stage.id)).toEqual([
      "push",
      "build",
      "test",
      "publish",
      "deploy",
    ]);
  });
});

describe("skills content", () => {
  it("lists each technology in only one group", () => {
    const names = skillGroups.flatMap((group) =>
      group.skills.map((skill) => skill.tech),
    );

    expect(new Set(names).size).toBe(names.length);
  });
});
