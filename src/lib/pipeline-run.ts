import {
  eventLabels,
  type CiJob,
  type CiJobId,
  type RunState,
  type Scenario,
} from "@/content/lab-pipeline";

export type RunFrame = Record<CiJobId, RunState>;

/**
 * The playback timeline: all pending, then each dependency level running and resolving in turn.
 * Skipped jobs resolve without running, and a level with nothing to run takes a single frame.
 */
export function runFrames(
  jobs: readonly CiJob[],
  outcome: RunOutcome,
): RunFrame[] {
  let frame = Object.fromEntries(
    jobs.map((job) => [job.id, "pending"]),
  ) as RunFrame;
  const frames = [frame];
  const push = (ids: CiJobId[], state: (id: CiJobId) => RunState) => {
    frame = {
      ...frame,
      ...Object.fromEntries(ids.map((id) => [id, state(id)])),
    };
    frames.push(frame);
  };

  for (const level of dependencyLevels(jobs)) {
    const isSkipped = (id: CiJobId) => outcome[id].state === "skipped";
    if (!level.every(isSkipped)) {
      push(level, (id) => (isSkipped(id) ? "skipped" : "running"));
    }
    push(level, (id) => outcome[id].state);
  }
  return frames;
}

export type FinalState = "passed" | "failed" | "skipped";
/** A job's final state and why, plus one state per step in declared order. */
export type JobOutcome = {
  state: FinalState;
  reason: string;
  steps: FinalState[];
};
export type RunOutcome = Record<CiJobId, JobOutcome>;

/** The final state of every job in a scenario, with the reason, derived from events and `needs`. */
export function resolveRun(
  jobs: readonly CiJob[],
  scenario: Scenario,
): RunOutcome {
  const outcomes = {} as RunOutcome;
  for (const id of topologicalOrder(jobs)) {
    const job = jobs.find((candidate) => candidate.id === id)!;
    outcomes[id] = resolveJob(job, scenario, outcomes);
  }
  return outcomes;
}

function resolveJob(
  job: CiJob,
  scenario: Scenario,
  resolved: RunOutcome,
): JobOutcome {
  const skipped = (reason: string): JobOutcome => ({
    state: "skipped",
    reason,
    steps: job.steps.map(() => "skipped"),
  });

  if (!job.events.includes(scenario.event)) {
    const only = job.events.map((event) => eventLabels[event]).join(" and ");
    return skipped(`Runs only on ${only}.`);
  }
  const blocker =
    job.needs.find((need) => resolved[need].state === "failed") ??
    job.needs.find((need) => resolved[need].state === "skipped");
  if (blocker) {
    const why = resolved[blocker].state === "failed" ? "failed" : "was skipped";
    return skipped(`Needs ${blocker}, which ${why}.`);
  }

  const failure = scenario.failure?.job === job.id ? scenario.failure : null;
  let failed = false;
  const steps = job.steps.map((step): FinalState => {
    if (step.name === failure?.step) {
      failed = true;
      return "failed";
    }
    const runs =
      (step.onFailure ? failed : !failed) &&
      (!step.events || step.events.includes(scenario.event));
    return runs ? "passed" : "skipped";
  });

  return failure
    ? { state: "failed", reason: failure.reason, steps }
    : { state: "passed", reason: "Every step passed.", steps };
}

/** Jobs grouped by how many dependency hops precede them; each group can run in parallel. */
export function dependencyLevels(jobs: readonly CiJob[]): CiJobId[][] {
  const level = new Map<CiJobId, number>();
  const levelOf = (job: CiJob): number => {
    if (!level.has(job.id)) {
      const needed = jobs.filter((other) => job.needs.includes(other.id));
      level.set(job.id, Math.max(-1, ...needed.map(levelOf)) + 1);
    }
    return level.get(job.id)!;
  };

  const levels: CiJobId[][] = [];
  for (const job of jobs) (levels[levelOf(job)] ??= []).push(job.id);
  return levels;
}

/** Every job after the jobs it needs, keeping the declared order within a level. */
export function topologicalOrder(jobs: readonly CiJob[]): CiJobId[] {
  return dependencyLevels(jobs).flat();
}
