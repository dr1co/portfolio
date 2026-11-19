import { RunStateBadge } from "@/components/lab/run-state-badge";
import { AppLink } from "@/components/ui/app-link";
import { getAbout } from "@/content/about";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { getSiteConfig } from "@/lib/site-config";

/** The whoami workflow: one card per job with its state and summary, each linking to its section on `/about`. Static. */
export function AboutPipeline({
  locale,
  age,
}: {
  locale: Locale;
  age: number;
}) {
  const t = getMessages(locale);
  const { nickname, location } = getSiteConfig(locale);
  const { jobs } = getAbout(locale);

  return (
    <ol aria-label={t.about.jobs} className="grid gap-3 md:grid-cols-4">
      {jobs.map((job, index) => {
        const lines =
          job.id === "whoami"
            ? [t.about.identity(nickname, age, location), ...job.summary]
            : job.summary;
        return (
          <li
            key={job.id}
            className="relative flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/50 hover:bg-surface-elevated"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-baseline gap-2 font-mono">
                <span aria-hidden className="text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <AppLink
                  href={`/about#${job.id}`}
                  className="font-semibold after:absolute after:inset-0 after:rounded-lg hover:text-accent"
                >
                  {job.id}
                </AppLink>
              </span>
              <RunStateBadge state={job.state} locale={locale} spin={false} />
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {index < jobs.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-3 left-8 h-3 w-px bg-border md:top-1/2 md:-right-3 md:bottom-auto md:left-auto md:h-px md:w-3"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
