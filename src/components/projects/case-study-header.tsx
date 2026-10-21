import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import { projectGroups, type Project } from "@/content/projects";
import { techName } from "@/content/technologies";
import { StatusBadge } from "./status-badge";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline";

/** Case-study page header: group, title, lead, status, technologies, links and last update. */
export function CaseStudyHeader({ project }: { project: Project }) {
  const group = projectGroups.find((item) => item.id === project.group);

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
        <StatusBadge status={project.status} />
        <ul aria-label="Technologies" className="flex flex-wrap gap-2">
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
            Source
          </AppLink>
        )}
        {project.demoUrl && (
          <AppLink href={project.demoUrl} external className={linkClass}>
            Live demo
          </AppLink>
        )}
        {project.lastUpdated && (
          <p>
            Updated{" "}
            <time dateTime={project.lastUpdated}>
              {dateFormat.format(new Date(project.lastUpdated))}
            </time>
          </p>
        )}
      </div>
    </header>
  );
}
