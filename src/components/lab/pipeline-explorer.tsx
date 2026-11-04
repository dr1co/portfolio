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
import {
  Fragment,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import { useMediaQuery } from "@/lib/use-media-query";
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

const WIDE_QUERY = "(min-width: 64rem)";
const BELOW_ID = "pipeline-panel";
const INLINE_ID = "pipeline-panel-inline";

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
  const [open, setOpen] = useState(true);
  const mounted = useIsMounted();
  const wide = useMediaQuery(WIDE_QUERY);
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
  const { tabProps } = useRovingTabs(count, { selected, onSelect: select });
  const job = selected > 0 ? ordered[selected - 1] : null;
  const tabId = (index: number) => `pipeline-node-${index}`;
  // Before hydration both panel slots render and CSS shows the right one; afterwards only that one exists.
  const showBelow = !mounted || wide;
  const showInline = (!mounted || !wide) && open;

  function select(index: number) {
    setSelected(index);
    setOpen(true);
  }

  function chooseScenario(id: Scenario["id"]) {
    setScenarioId(id);
    select(0);
  }

  const panel = (
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
  );

  const node = (
    current: number,
    label: string,
    icon: LabIcon,
    status: ReactNode,
    note: string,
  ) => {
    const Icon = ICONS[icon];
    const expanded = current === selected && open;
    const active = wide ? current === selected : expanded;
    const headerProps = wide
      ? { ...tabProps(current), "aria-controls": BELOW_ID }
      : {
          type: "button" as const,
          "aria-expanded": expanded,
          "aria-controls": expanded ? INLINE_ID : undefined,
          onClick: () =>
            current === selected ? setOpen(!open) : select(current),
        };
    return (
      <Fragment key={current}>
        <button
          id={tabId(current)}
          {...headerProps}
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
        {current === selected && showInline && (
          <div
            id={INLINE_ID}
            role={wide ? undefined : "region"}
            aria-labelledby={tabId(current)}
            className="mb-3 lg:hidden"
          >
            {panel}
          </div>
        )}
      </Fragment>
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
        role={wide ? "tablist" : undefined}
        aria-label={wide ? "Workflow jobs" : undefined}
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

      {showBelow && (
        <div className="hidden flex-col gap-8 lg:flex">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Previous job"
              disabled={selected === 0}
              onClick={() => select(selected - 1)}
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
              onClick={() => select(selected + 1)}
              className={navButtonClass}
            >
              Next
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>

          <div
            id={BELOW_ID}
            role={wide ? "tabpanel" : undefined}
            aria-labelledby={tabId(selected)}
            tabIndex={wide ? 0 : undefined}
            className="rounded-lg focus-visible:outline-offset-4"
          >
            {panel}
          </div>
        </div>
      )}
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
