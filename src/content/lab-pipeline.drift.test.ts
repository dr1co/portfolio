// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  ciJobs,
  pipelineTrigger,
  type CiStep,
  type PipelineEvent,
} from "./lab-pipeline";

type WorkflowStep = { name?: string; uses?: string; run?: string; if?: string };
type WorkflowJob = {
  needs?: string | string[];
  if?: string;
  steps: WorkflowStep[];
};
type Workflow = { jobs: Record<string, WorkflowJob> };

const source = readFileSync(
  join(process.cwd(), ".github/workflows/ci.yml"),
  "utf8",
);
const workflow: Workflow = parse(source);

const ALL_EVENTS: PipelineEvent[] = ["push-main", "pull-request"];

// Every `if:` in ci.yml, in model form. Same-repo PRs only: forks aren't modeled.
const CONDITIONS: Record<string, Pick<CiStep, "events" | "onFailure">> = {
  "github.event_name == 'push' && github.ref == 'refs/heads/main'": {
    events: ["push-main"],
  },
  "github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository":
    { events: ["pull-request"] },
  "github.event_name == 'push' || github.event.pull_request.head.repo.full_name == github.repository":
    {},
  "env.IS_MAIN_PUSH == 'true'": { events: ["push-main"] },
  "failure()": { onFailure: true },
};

function condition(expression: string | undefined) {
  if (expression === undefined) return {};
  const known = CONDITIONS[expression];
  if (!known) {
    throw new Error(
      `ci.yml has a new condition: "${expression}". Add it to CONDITIONS and update src/content/lab-pipeline.ts.`,
    );
  }
  return known;
}

/** The step's label as GitHub shows it: its name, else the action without its pinned ref, else the command. */
function stepName(step: WorkflowStep): string {
  return step.name ?? step.uses?.split("@")[0] ?? step.run!.trim();
}

function asList(value: string | string[] | undefined): string[] {
  return value === undefined ? [] : [value].flat();
}

describe("Lab pipeline model matches .github/workflows/ci.yml", () => {
  it("models exactly the workflow's jobs", () => {
    expect(ciJobs.map((job) => job.id).sort()).toEqual(
      Object.keys(workflow.jobs).sort(),
    );
  });

  it.each(ciJobs.map((job) => [job.id, job] as const))(
    "%s has the workflow's needs",
    (id, job) => {
      expect([...job.needs].sort()).toEqual(
        asList(workflow.jobs[id].needs).sort(),
      );
    },
  );

  it.each(ciJobs.map((job) => [job.id, job] as const))(
    "%s runs on the workflow's events",
    (id, job) => {
      const { events = ALL_EVENTS } = condition(workflow.jobs[id].if);
      expect(job.events).toEqual(events);
    },
  );

  it.each(ciJobs.map((job) => [job.id, job] as const))(
    "%s has the workflow's steps, in order, with their conditions",
    (id, job) => {
      expect(job.steps).toEqual(
        workflow.jobs[id].steps.map((step) => ({
          name: stepName(step),
          ...condition(step.if),
        })),
      );
    },
  );
});

const workflowLines = new Set(source.split("\n").map((line) => line.trim()));
const ELISION = "# …";
const PINNED_REF = /@[0-9a-f]{40}\b|@sha256:/;

const excerpts: [string, readonly string[]][] = [
  ["trigger", pipelineTrigger.excerpt],
  ...ciJobs.map((job): [string, readonly string[]] => [job.id, job.excerpt]),
];

describe.each(excerpts)("%s excerpt", (_, excerpt) => {
  it("quotes ci.yml verbatim, apart from elision markers", () => {
    const invented = excerpt.filter(
      (line) => line.trim() !== ELISION && !workflowLines.has(line.trim()),
    );
    expect(invented).toEqual([]);
  });

  it("contains no pinned refs, which change with every Dependabot bump", () => {
    expect(excerpt.filter((line) => PINNED_REF.test(line))).toEqual([]);
  });
});
