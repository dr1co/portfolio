import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import { getProjectGroups, type Project } from "@/content/projects";
import { techName } from "@/content/technologies";
import { intlLocales, type Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { StatusBadge } from "./status-badge";

const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline";

/** Case-study page header: group, title, lead, status, technologies, links and last update. */
export function CaseStudyHeader({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const group = getProjectGroups(locale).find(
    (item) => item.id === project.group,
  );
  const t = getMessages(locale).projects;
  const dateFormat = new Intl.DateTimeFormat(intlLocales[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <header className="max-w-[70ch]">
      {group && <p className="font-mono text-sm text-accent">{group.title}</p>}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {project.description || project.summary}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} locale={locale} />
        <ul aria-label={t.technologies} className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <Badge>{techName(tech)}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        {project.repositoryUrl && (
          <AppLink href={project.repositoryUrl} external className={linkClass}>
            {t.source}
          </AppLink>
        )}
        {project.demoUrl && (
          <AppLink href={project.demoUrl} external className={linkClass}>
            {t.liveDemo}
          </AppLink>
        )}
        {project.lastUpdated && (
          <p>
            {t.updated}{" "}
            <time dateTime={project.lastUpdated}>
              {dateFormat.format(new Date(project.lastUpdated))}
            </time>
          </p>
        )}
      </div>
    </header>
  );
}
