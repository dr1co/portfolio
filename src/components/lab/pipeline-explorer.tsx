"use client";

import {
  AppWindow,
  ChevronLeft,
  ChevronRight,
  Container,
  Eye,
  GitCommitHorizontal,
  ListChecks,
  Package,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  eventNames,
  type CiJob,
  type LabIcon,
  type PipelineTrigger,
  type Scenario,
} from "@/content/lab-pipeline";
import { cn } from "@/lib/cn";
import { dependencyLevels, resolveRun } from "@/lib/pipeline-run";
import { useIsMounted } from "@/lib/use-is-mounted";
import { useRovingTabs } from "@/lib/use-roving-tabs";
import { JobPanel, TriggerPanel } from "./job-panel";
import { RunStateBadge } from "./run-state-badge";
import { ScenarioPicker } from "./scenario-picker";

const ICONS: Record<LabIcon, LucideIcon> = {
  trigger: GitCommitHorizontal,
  checks: ListChecks,
  browser: AppWindow,
  container: Container,
  package: Package,
  preview: Eye,
  deploy: Rocket,
};

const navButtonClass =
  "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border";

/**
 * Simulated walkthrough of this site's real CI workflow: pick a scenario, then explore
 * the trigger and each job as tabs laid out by dependency level.
 */
export function PipelineExplorer({
  trigger,
  jobs,
  scenarios,
  workflowUrl,
}: {
  trigger: PipelineTrigger;
  jobs: readonly CiJob[];
  scenarios: readonly Scenario[];
  workflowUrl: string;
}) {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [selected, setSelected] = useState(0);
  const mounted = useIsMounted();
  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const outcome = useMemo(() => resolveRun(jobs, scenario), [jobs, scenario]);

  const levels = useMemo(
    () =>
      dependencyLevels(jobs).map((ids) =>
        ids.map((id) => jobs.find((job) => job.id === id)!),
      ),
    [jobs],
  );
  const ordered = levels.flat();
  const count = ordered.length + 1;
  const { tabProps } = useRovingTabs(count, {
    selected,
    onSelect: setSelected,
  });
  const job = selected > 0 ? ordered[selected - 1] : null;
  const tabId = (index: number) => `pipeline-node-${index}`;

  function chooseScenario(id: Scenario["id"]) {
    setScenarioId(id);
    setSelected(0);
  }

  const node = (
    current: number,
    label: string,
    icon: LabIcon,
    status: ReactNode,
    note: string,
  ) => {
    const Icon = ICONS[icon];
    const active = current === selected;
    return (
      <button
        key={current}
        id={tabId(current)}
        aria-controls="pipeline-panel"
        {...tabProps(current)}
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border px-4 py-3 text-left transition-colors",
          active
            ? "border-accent bg-surface-elevated"
            : "border-border bg-surface hover:border-accent/50",
        )}
      >
        <span className="flex items-center gap-2">
          <Icon
            aria-hidden
            className={cn("size-5 shrink-0", active && "text-accent")}
          />
          <span className={cn("text-sm", active && "font-semibold")}>
            {label}
          </span>
        </span>
        {status}
        <span className="font-mono text-xs text-muted">{note}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ScenarioPicker
          scenarios={scenarios}
          selected={scenarioId}
          onSelect={chooseScenario}
        />
        <p className="mt-3 max-w-prose text-muted">{scenario.summary}</p>
      </div>

      <div
        role="tablist"
        aria-label="Workflow jobs"
        className="grid gap-3 lg:grid-cols-[repeat(var(--columns),minmax(0,1fr))] lg:gap-8"
        style={{ "--columns": levels.length + 1 } as CSSProperties}
      >
        <Column first>
          {node(
            0,
            trigger.label,
            trigger.icon,
            null,
            `event: ${eventNames[scenario.event]}`,
          )}
        </Column>
        {levels.map((level, levelIndex) => (
          <Column key={levelIndex}>
            {level.map((item) =>
              node(
                ordered.indexOf(item) + 1,
                item.label,
                item.icon,
                <RunStateBadge state={outcome[item.id].state} />,
                item.needs.length > 0
                  ? `needs: ${item.needs.join(", ")}`
                  : "needs: nothing",
              ),
            )}
          </Column>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Previous job"
          disabled={selected === 0}
          onClick={() => setSelected(selected - 1)}
          className={navButtonClass}
        >
          <ChevronLeft aria-hidden className="size-4" />
          Previous
        </button>
        <span className="font-mono text-sm text-muted">
          {selected + 1} / {count}
        </span>
        <button
          type="button"
          aria-label="Next job"
          disabled={selected === count - 1}
          onClick={() => setSelected(selected + 1)}
          className={navButtonClass}
        >
          Next
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <div
        id="pipeline-panel"
        role="tabpanel"
        aria-labelledby={tabId(selected)}
        tabIndex={0}
        className="rounded-lg focus-visible:outline-offset-4"
      >
        <motion.div
          key={`${scenarioId}-${selected}`}
          initial={mounted ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {job ? (
            <JobPanel
              job={job}
              outcome={outcome[job.id]}
              workflowUrl={workflowUrl}
            />
          ) : (
            <TriggerPanel
              trigger={trigger}
              scenario={scenario}
              workflowUrl={workflowUrl}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Column({
  first = false,
  children,
}: {
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center gap-3">
      {!first && (
        <ChevronRight
          aria-hidden
          className="absolute top-1/2 -left-7 hidden size-5 -translate-y-1/2 text-muted lg:block"
        />
      )}
      {children}
    </div>
  );
}
