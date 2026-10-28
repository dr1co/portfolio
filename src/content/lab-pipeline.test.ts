import { describe, expect, it } from "vitest";
import { ciJobs, pipelineScenarios } from "./lab-pipeline";

describe("pipeline scenarios", () => {
  it("have unique ids", () => {
    const ids = pipelineScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(
    pipelineScenarios
      .filter((scenario) => scenario.failure)
      .map((scenario) => [scenario.id, scenario.failure!] as const),
  )("%s fails at a step that exists in its job", (_, failure) => {
    const job = ciJobs.find((candidate) => candidate.id === failure.job);
    expect(job?.steps.map((step) => step.name)).toContain(failure.step);
  });
});
