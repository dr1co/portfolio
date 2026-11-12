import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { AppLink } from "@/components/ui/app-link";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects, type Project } from "@/content/projects";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { isRouteEnabled } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";

/** Featured project cards, plus a link to the directory once it is live; renders nothing until a project is featured. */
export function FeaturedProjects({
  locale,
  projects = getFeaturedProjects(locale),
}: {
  locale: Locale;
  projects?: readonly Project[];
}) {
  if (projects.length === 0) return null;
  const directoryLive = isRouteEnabled(siteConfig.routes, "/projects");
  const t = getMessages(locale).featured;

  return (
    <Section id="projects" eyebrow={t.eyebrow} title={t.title}>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            showCaseStudy={directoryLive}
          />
        ))}
      </div>
      {directoryLive && (
        <AppLink
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 font-medium text-accent hover:underline"
        >
          {t.viewAll}
          <ArrowRight aria-hidden className="size-4" />
        </AppLink>
      )}
    </Section>
  );
}
