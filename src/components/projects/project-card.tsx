import { CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import type { Project, ProjectStatus } from "@/content/projects";

const STATUS: Record<
  Exclude<ProjectStatus, "planned">,
  { label: string; icon: LucideIcon; tone: "accent" | "info" }
> = {
  available: { label: "Available", icon: CheckCircle2, tone: "accent" },
  "in-progress": { label: "In progress", icon: Clock, tone: "info" },
};

const MAX_TECHNOLOGIES = 5;
const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline";

/** Project summary card. Every link is optional and only rendered when it exists. */
export function ProjectCard({
  project,
  showCaseStudy = false,
}: {
  project: Project;
  showCaseStudy?: boolean;
}) {
  const status =
    project.status === "planned" ? undefined : STATUS[project.status];

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/50 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {status && (
          <Badge icon={status.icon} tone={status.tone} className="shrink-0">
            {status.label}
          </Badge>
        )}
      </div>
      <p className="mt-2 text-muted">{project.summary}</p>
      <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, MAX_TECHNOLOGIES).map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-4 pt-6 empty:hidden">
        {showCaseStudy && project.caseStudy && (
          <AppLink
            href={`/projects/${project.caseStudy}`}
            className={linkClass}
          >
            Case study
          </AppLink>
        )}
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
      </div>
    </article>
  );
}
