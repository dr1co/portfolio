import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/content/projects";
import { techName } from "@/content/technologies";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { StatusBadge } from "./status-badge";

const MAX_TECHNOLOGIES = 5;
const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline";

/** Project summary card. Every link is optional and only rendered when it exists. */
export function ProjectCard({
  project,
  locale,
  showCaseStudy = false,
}: {
  project: Project;
  locale: Locale;
  showCaseStudy?: boolean;
}) {
  const caseStudyHref =
    showCaseStudy && project.caseStudy
      ? `/projects/${project.slug}`
      : undefined;
  const t = getMessages(locale).projects;

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/50 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">
          {caseStudyHref ? (
            <AppLink
              href={caseStudyHref}
              className="hover:text-accent hover:underline"
            >
              {project.title}
            </AppLink>
          ) : (
            project.title
          )}
        </h3>
        <StatusBadge status={project.status} locale={locale} />
      </div>
      <p className="mt-2 text-muted">{project.summary}</p>
      <ul aria-label={t.technologies} className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, MAX_TECHNOLOGIES).map((tech) => (
          <li key={tech}>
            <Badge>{techName(tech)}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-4 pt-6 empty:hidden">
        {caseStudyHref && (
          <AppLink href={caseStudyHref} className={linkClass}>
            {t.caseStudy}
          </AppLink>
        )}
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
      </div>
    </article>
  );
}
