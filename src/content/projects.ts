import { isHttpsUrl } from "@/lib/links";
import type { TechnologyId } from "./technologies";

export type ProjectStatus = "available" | "in-progress" | "planned";

/** Directory groups, in display order. */
export const projectGroups = [
  { id: "devops", title: "DevOps & Delivery" },
  { id: "backend", title: "Backend & Automation" },
  { id: "ml", title: "Machine Learning" },
] as const;

export type ProjectGroup = (typeof projectGroups)[number];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  status: ProjectStatus;
  technologies: readonly TechnologyId[];
  categories: readonly string[];
  group: ProjectGroup["id"];
  repositoryUrl?: string;
  demoUrl?: string;
  caseStudy?: string;
  featured: boolean;
  lastUpdated?: string;
};

// TODO(content): review summaries, statuses and technologies before publishing.
export const projects: readonly Project[] = [
  {
    slug: "tcc-engsoftware",
    title: "Financial market analysis with Deep Learning Techniques",
    summary:
      "The project presented in my undergraduate thesis, covering stock market analysis using LSTM and CNN models, as well as a hybrid between these.",
    description: "",
    status: "in-progress",
    technologies: ["python", "pytorch", "tensorflow", "keras", "metatrader5"],
    categories: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "Stock Market",
    ],
    group: "ml",
    repositoryUrl: "https://github.com/dr1co/tcc-engsoftware",
    featured: true,
  },
  {
    slug: "django-project-template",
    title: "Django Project Template for automated project building",
    summary:
      "My go-to template for Django projects, featuring integration with tailwind, structured tests, and more!",
    description:
      "A generic Django starter derived from a template I originally built for Princesa dos Campos to standardize their full-stack web projects. It packages the same conventions (Tailwind integration, structured tests, containerized setup) without any company-specific code.",
    status: "available",
    technologies: ["python", "django", "tailwind", "docker", "github-packages"],
    categories: ["DevOps"],
    group: "devops",
    repositoryUrl: "https://github.com/dr1co/django-project-template",
    featured: true,
  },
];

const MAX_FEATURED = 4;

const isPublished = (project: Project) => project.status !== "planned";

function withPublishableLinks(project: Project): Project {
  return {
    ...project,
    repositoryUrl: isHttpsUrl(project.repositoryUrl)
      ? project.repositoryUrl
      : undefined,
    demoUrl: isHttpsUrl(project.demoUrl) ? project.demoUrl : undefined,
  };
}

/** Featured projects that are ready to show: not planned, capped at four, unpublishable links removed. */
export function getFeaturedProjects(
  list: readonly Project[] = projects,
): Project[] {
  return list
    .filter((project) => project.featured && isPublished(project))
    .slice(0, MAX_FEATURED)
    .map(withPublishableLinks);
}

const STATUS_ORDER: Record<ProjectStatus, number> = {
  available: 0,
  "in-progress": 1,
  planned: 2,
};

function byFeaturedStatusTitle(a: Project, b: Project): number {
  return (
    Number(b.featured) - Number(a.featured) ||
    STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
    a.title.localeCompare(b.title)
  );
}

/** Published projects arranged by group, in group order and sorted within each group; empty groups are omitted. */
export function getProjectDirectory(
  list: readonly Project[] = projects,
): { group: ProjectGroup; projects: Project[] }[] {
  return projectGroups
    .map((group) => ({
      group,
      projects: list
        .filter((project) => project.group === group.id && isPublished(project))
        .sort(byFeaturedStatusTitle)
        .map(withPublishableLinks),
    }))
    .filter(({ projects }) => projects.length > 0);
}

const hasCaseStudy = (project: Project) =>
  isPublished(project) && Boolean(project.caseStudy);

/** Slugs of published projects with a case study (feeds `generateStaticParams`). */
export function getCaseStudySlugs(
  list: readonly Project[] = projects,
): string[] {
  return list.filter(hasCaseStudy).map((project) => project.slug);
}

/** The published project with a case study for `slug`, links validated; `undefined` otherwise. */
export function getProject(
  slug: string,
  list: readonly Project[] = projects,
): Project | undefined {
  const project = list.find((item) => item.slug === slug);
  return project && hasCaseStudy(project)
    ? withPublishableLinks(project)
    : undefined;
}
