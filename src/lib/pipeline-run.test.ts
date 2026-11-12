import { describe, expect, it } from "vitest";
import {
  getLabPipeline,
  type CiJobId,
  type Scenario,
} from "@/content/lab-pipeline";
import {
  dependencyLevels,
  describeFrame,
  resolveRun,
  runFrames,
  summarizeRun,
  topologicalOrder,
} from "./pipeline-run";

const { jobs: ciJobs, scenarios: pipelineScenarios } = getLabPipeline("en");

function scenario(id: Scenario["id"]): Scenario {
  return pipelineScenarios.find((candidate) => candidate.id === id)!;
}

function summary(id: Scenario["id"]) {
  const outcomes = resolveRun(ciJobs, scenario(id), "en");
  return Object.fromEntries(
    Object.entries(outcomes).map(([job, { state, reason }]) => [
      job,
      `${state}: ${reason}`,
    ]),
  );
}

describe("dependencyLevels", () => {
  it("groups jobs that can run together, after everything they need", () => {
    expect(dependencyLevels(ciJobs)).toEqual([
      ["quality", "e2e", "image"],
      ["publish", "deploy-preview"],
      ["deploy-production"],
    ]);
  });
});

describe("topologicalOrder", () => {
  it("lists every job after the jobs it needs", () => {
    expect(topologicalOrder(ciJobs)).toEqual([
      "quality",
      "e2e",
      "image",
      "publish",
      "deploy-preview",
      "deploy-production",
    ]);
  });
});

/** Frames as rows of job states in topological order, for readable expectations. */
function frames(id: Scenario["id"]) {
  return runFrames(ciJobs, resolveRun(ciJobs, scenario(id), "en")).map(
    (frame) => topologicalOrder(ciJobs).map((job) => frame[job]),
  );
}

describe("runFrames", () => {
  it("runs each level in turn: running, then its outcomes", () => {
    expect(frames("push-main")).toEqual([
      ["pending", "pending", "pending", "pending", "pending", "pending"],
      ["running", "running", "running", "pending", "pending", "pending"],
      ["passed", "passed", "passed", "pending", "pending", "pending"],
      ["passed", "passed", "passed", "running", "skipped", "pending"],
      ["passed", "passed", "passed", "passed", "skipped", "pending"],
      ["passed", "passed", "passed", "passed", "skipped", "running"],
      ["passed", "passed", "passed", "passed", "skipped", "passed"],
    ]);
  });

  it("resolves a level where every job is skipped in a single frame", () => {
    expect(frames("failure-main").slice(2)).toEqual([
      ["passed", "failed", "passed", "pending", "pending", "pending"],
      ["passed", "failed", "passed", "skipped", "skipped", "pending"],
      ["passed", "failed", "passed", "skipped", "skipped", "skipped"],
    ]);
  });

  it.each(pipelineScenarios.map((s) => [s.id] as const))(
    "%s ends on the resolved outcome, and skipped jobs never run",
    (id) => {
      const outcome = resolveRun(ciJobs, scenario(id), "en");
      const all = runFrames(ciJobs, outcome);

      expect(all.at(-1)).toEqual(
        Object.fromEntries(
          Object.entries(outcome).map(([job, { state }]) => [job, state]),
        ),
      );
      for (const [job, { state }] of Object.entries(outcome)) {
        if (state !== "skipped") continue;
        expect(all.map((frame) => frame[job as CiJobId])).not.toContain(
          "running",
        );
      }
    },
  );
});

describe("describeFrame", () => {
  const all = (id: Scenario["id"]) =>
    runFrames(ciJobs, resolveRun(ciJobs, scenario(id), "en"));

  it("announces the start of a run", () => {
    expect(describeFrame(ciJobs, all("push-main"), 0, "en")).toBe(
      "Run started. Every job is pending.",
    );
  });

  it("names the jobs that start running, by label", () => {
    expect(describeFrame(ciJobs, all("push-main"), 1, "en")).toBe(
      "Running: Quality, E2E tests, Image.",
    );
  });

  it("names the jobs that finish, with their outcome", () => {
    expect(describeFrame(ciJobs, all("failure-main"), 2, "en")).toBe(
      "Quality passed. E2E tests failed. Image passed.",
    );
  });

  it("combines jobs that start and jobs that are skipped in the same frame", () => {
    expect(describeFrame(ciJobs, all("push-main"), 3, "en")).toBe(
      "Running: Publish. Preview deploy skipped.",
    );
  });
});

describe("summarizeRun", () => {
  it("counts the final outcomes, leaving out the ones that didn't happen", () => {
    expect(
      summarizeRun(resolveRun(ciJobs, scenario("push-main"), "en"), "en"),
    ).toBe("Run finished: 5 passed, 1 skipped.");
    expect(
      summarizeRun(resolveRun(ciJobs, scenario("failure-main"), "en"), "en"),
    ).toBe("Run finished: 2 passed, 1 failed, 3 skipped.");
  });
});

function steps(id: Scenario["id"], job: CiJobId) {
  const definition = ciJobs.find((candidate) => candidate.id === job)!;
  const { steps: states } = resolveRun(ciJobs, scenario(id), "en")[job];
  return definition.steps.map((step, index) => [step.name, states[index]]);
}

describe("resolveRun steps", () => {
  it("skips a failure-only step when the job passes", () => {
    expect(steps("push-main", "e2e")).toEqual([
      ["actions/checkout", "passed"],
      ["./.github/actions/setup", "passed"],
      ["End-to-end tests", "passed"],
      ["Upload Playwright report", "skipped"],
    ]);
  });

  it("runs the failure-only step after the failing one", () => {
    expect(steps("failure-main", "e2e")).toEqual([
      ["actions/checkout", "passed"],
      ["./.github/actions/setup", "passed"],
      ["End-to-end tests", "failed"],
      ["Upload Playwright report", "passed"],
    ]);
  });

  it("skips the steps after a failure", () => {
    expect(steps("vulnerable-image", "image").slice(-2)).toEqual([
      ["Fail on fixable CRITICAL/HIGH vulnerabilities", "failed"],
      ["Keep the tested image for publishing", "skipped"],
    ]);
  });

  it("skips steps limited to other events", () => {
    expect(steps("pull-request", "image").at(-1)).toEqual([
      "Keep the tested image for publishing",
      "skipped",
    ]);
    expect(steps("push-main", "image").at(-1)).toEqual([
      "Keep the tested image for publishing",
      "passed",
    ]);
  });

  it("skips every step of a skipped job", () => {
    expect(new Set(steps("pull-request", "publish").map(([, s]) => s))).toEqual(
      new Set(["skipped"]),
    );
  });
});

describe("resolveRun", () => {
  it("push to main: everything runs except the pull-request preview", () => {
    expect(summary("push-main")).toEqual({
      quality: "passed: Every step passed.",
      e2e: "passed: Every step passed.",
      image: "passed: Every step passed.",
      publish: "passed: Every step passed.",
      "deploy-preview": "skipped: Runs only on pull requests.",
      "deploy-production": "passed: Every step passed.",
    });
  });

  it("pull request: checks and a preview, nothing published", () => {
    expect(summary("pull-request")).toEqual({
      quality: "passed: Every step passed.",
      e2e: "passed: Every step passed.",
      image: "passed: Every step passed.",
      publish: "skipped: Runs only on pushes to main.",
      "deploy-preview": "passed: Every step passed.",
      "deploy-production": "skipped: Runs only on pushes to main.",
    });
  });

  it("failure on main: a failed job skips everything that needs it", () => {
    expect(summary("failure-main")).toEqual({
      quality: "passed: Every step passed.",
      e2e: "failed: An end-to-end test fails.",
      image: "passed: Every step passed.",
      publish: "skipped: Needs e2e, which failed.",
      "deploy-preview": "skipped: Runs only on pull requests.",
      "deploy-production": "skipped: Needs publish, which was skipped.",
    });
  });

  it("vulnerable image: the security gate stops publishing", () => {
    expect(summary("vulnerable-image")).toMatchObject({
      image: "failed: Trivy finds a fixable CRITICAL vulnerability.",
      publish: "skipped: Needs image, which failed.",
      "deploy-production": "skipped: Needs publish, which was skipped.",
    });
  });
});
