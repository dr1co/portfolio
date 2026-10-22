import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { AppLink } from "@/components/ui/app-link";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects, type Project } from "@/content/projects";
import { isRouteEnabled } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";

/** Featured project cards, plus a link to the directory once it is live; renders nothing until a project is featured. */
export function FeaturedProjects({
  projects = getFeaturedProjects(),
}: {
  projects?: readonly Project[];
}) {
  if (projects.length === 0) return null;
  const directoryLive = isRouteEnabled(siteConfig.routes, "/projects");

  return (
    <Section id="projects" eyebrow="// projects" title="Featured projects">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            showCaseStudy={directoryLive}
          />
        ))}
      </div>
      {directoryLive && (
        <AppLink
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 font-medium text-accent hover:underline"
        >
          View all projects
          <ArrowRight aria-hidden className="size-4" />
        </AppLink>
      )}
    </Section>
  );
}
