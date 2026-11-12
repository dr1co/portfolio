import { ScrollArea } from "@/components/ui/scroll-area";
import type { CiJob, Scenario } from "@/content/lab-pipeline";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { resolveRun } from "@/lib/pipeline-run";
import { RunStateBadge } from "./run-state-badge";

/** Every job's outcome in every scenario, as a static table. Works without JavaScript. */
export function OutcomeMatrix({
  jobs,
  scenarios,
  locale,
}: {
  jobs: readonly CiJob[];
  scenarios: readonly Scenario[];
  locale: Locale;
}) {
  const t = getMessages(locale).explorer;
  const outcomes = scenarios.map((scenario) =>
    resolveRun(jobs, scenario, locale),
  );

  return (
    <ScrollArea label={t.outcomes} className="rounded-lg border border-border">
      <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
        <caption className="sr-only">{t.outcomesCaption}</caption>
        <thead className="bg-surface-elevated">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t.job}
            </th>
            {scenarios.map((scenario) => (
              <th
                key={scenario.id}
                scope="col"
                className="px-4 py-3 font-semibold"
              >
                {scenario.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-border align-top">
              <th scope="row" className="px-4 py-3 font-mono font-medium">
                {job.label}
              </th>
              {outcomes.map((outcome, index) => (
                <td key={scenarios[index].id} className="px-4 py-3">
                  <RunStateBadge
                    state={outcome[job.id].state}
                    locale={locale}
                  />
                  <p className="mt-1 text-muted">{outcome[job.id].reason}</p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
