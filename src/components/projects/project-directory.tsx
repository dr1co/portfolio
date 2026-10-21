import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { getProjectDirectory } from "@/content/projects";
import { isRouteEnabled } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";
import { ProjectCard } from "./project-card";

/** Project groups, each as a labelled region with an h2 and a grid of cards. Only the first group skips the reveal. */
export function ProjectDirectory({
  directory,
}: {
  directory: ReturnType<typeof getProjectDirectory>;
}) {
  const showCaseStudy = isRouteEnabled(siteConfig.routes, "/projects");

  return (
    <Container className="flex flex-col gap-16 pb-20">
      {directory.map(({ group, projects }, index) => {
        const content = (
          <section aria-labelledby={`group-${group.id}`}>
            <h2
              id={`group-${group.id}`}
              className="text-2xl font-semibold tracking-tight"
            >
              {group.title}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  showCaseStudy={showCaseStudy}
                />
              ))}
            </div>
          </section>
        );
        return index === 0 ? (
          <div key={group.id}>{content}</div>
        ) : (
          <Reveal key={group.id}>{content}</Reveal>
        );
      })}
    </Container>
  );
}
