import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects, type Project } from "@/content/projects";
import { isRouteEnabled } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";

/** Featured project cards; renders nothing until a project is featured. */
export function FeaturedProjects({
  projects = getFeaturedProjects(),
}: {
  projects?: readonly Project[];
}) {
  if (projects.length === 0) return null;
  const showCaseStudy = isRouteEnabled(siteConfig.routes, "/projects");

  return (
    <Section id="projects" eyebrow="// projects" title="Featured projects">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            showCaseStudy={showCaseStudy}
          />
        ))}
      </div>
    </Section>
  );
}
