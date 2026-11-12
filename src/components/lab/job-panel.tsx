import type { ReactNode } from "react";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { AppLink } from "@/components/ui/app-link";
import {
  workflowPath,
  type CiJob,
  type PipelineTrigger,
  type RunState,
  type Scenario,
} from "@/content/lab-pipeline";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { isHttpsUrl } from "@/lib/links";
import type { JobOutcome } from "@/lib/pipeline-run";
import { RunStateBadge } from "./run-state-badge";

/**
 * Details of one job in the current scenario: outcome and reason, dependencies, steps and the real YAML.
 * `state` is the job's state at the current point of a run; the outcome stays hidden until it's final.
 */
export function JobPanel({
  job,
  outcome,
  state = outcome.state,
  workflowUrl,
  locale,
}: {
  job: CiJob;
  outcome: JobOutcome;
  state?: RunState;
  workflowUrl: string;
  locale: Locale;
}) {
  const finished = state === outcome.state;
  const { explorer: t, run } = getMessages(locale);
  return (
    <PanelLayout
      title={job.label}
      badge={<RunStateBadge state={state} locale={locale} />}
      purpose={job.purpose}
      explanation={job.explanation}
      excerpt={job.excerpt}
      workflowUrl={workflowUrl}
      locale={locale}
      details={
        <>
          <p className="mt-4">
            <span className="font-medium">{t.simulatedOutcome}</span>{" "}
            {finished ? outcome.reason : t.notDecided}
          </p>
          <dl className="mt-4 flex flex-col gap-1 font-mono text-sm">
            <div>
              <dt className="inline text-muted">{t.needsLabel}</dt>{" "}
              <dd className="inline">
                {job.needs.length > 0 ? job.needs.join(", ") : t.nothing}
              </dd>
            </div>
            <div>
              <dt className="inline text-muted">{t.runsOn}</dt>{" "}
              <dd className="inline">
                {job.events
                  .map((event) => run.eventLabels[event])
                  .join(run.and)}
              </dd>
            </div>
          </dl>
        </>
      }
      aside={
        <ol
          aria-label={t.steps}
          className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4"
        >
          {job.steps.map((step, index) => (
            <li
              key={step.name}
              className="flex items-start justify-between gap-3"
            >
              <span className="min-w-0 font-mono text-sm break-words">
                {step.name}
              </span>
              <RunStateBadge
                state={finished ? outcome.steps[index] : "pending"}
                locale={locale}
                className="shrink-0"
              />
            </li>
          ))}
        </ol>
      }
    />
  );
}

/** Details of the event that starts the run in the current scenario. */
export function TriggerPanel({
  trigger,
  scenario,
  workflowUrl,
  locale,
}: {
  trigger: PipelineTrigger;
  scenario: Scenario;
  workflowUrl: string;
  locale: Locale;
}) {
  return (
    <PanelLayout
      title={trigger.label}
      purpose={trigger.purpose}
      explanation={trigger.explanation}
      excerpt={trigger.excerpt}
      workflowUrl={workflowUrl}
      locale={locale}
      details={
        <p className="mt-4">
          <span className="font-medium">
            {getMessages(locale).explorer.thisScenario}
          </span>{" "}
          {scenario.summary}
        </p>
      }
    />
  );
}

function PanelLayout({
  title,
  badge,
  purpose,
  explanation,
  details,
  aside,
  excerpt,
  workflowUrl,
  locale,
}: {
  title: string;
  badge?: ReactNode;
  purpose: string;
  explanation: string;
  details: ReactNode;
  aside?: ReactNode;
  excerpt: readonly string[];
  workflowUrl: string;
  locale: Locale;
}) {
  const t = getMessages(locale).explorer;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          {badge}
        </div>
        <p className="mt-2 text-lg">{purpose}</p>
        <p className="mt-3 text-muted">{explanation}</p>
        {details}
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {aside}
        <details className="rounded-lg">
          <summary className="cursor-pointer font-mono text-sm text-muted hover:text-foreground">
            {t.workflowExcerpt}
          </summary>
          <div className="mt-3">
            <TerminalPanel title={workflowPath} lines={excerpt} />
          </div>
        </details>
        {isHttpsUrl(workflowUrl) && (
          <AppLink
            href={workflowUrl}
            external
            className="text-sm font-medium text-accent hover:underline"
          >
            {t.viewWorkflow}
          </AppLink>
        )}
      </div>
    </div>
  );
}
