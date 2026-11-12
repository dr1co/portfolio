import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import { isHttpsUrl } from "@/lib/links";
import type { TechnologyId } from "./technologies";

export type ProjectStatus = "available" | "in-progress" | "planned";

/** Intro shown on the /projects directory page and used as its meta description. */
// TODO(content): review directory intro wording.
export const directoryIntro: Localized = {
  en: "Things I have built, grouped by area. Each card says what exists today and links to the source. Projects with a case study shows a deep dive into the decisions behind them.",
};

/** Directory groups, in display order. */
export const projectGroups = [
  { id: "devops", title: { en: "DevOps & Delivery" } },
  { id: "backend", title: { en: "Backend & Automation" } },
  { id: "ml", title: { en: "Machine Learning" } },
] as const satisfies readonly { id: string; title: Localized }[];

export type ProjectGroup = Resolved<(typeof projectGroups)[number]>;

type ProjectEntry = {
  slug: string;
  title: Localized;
  summary: Localized;
  description?: Localized;
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

export type Project = Resolved<ProjectEntry>;

export const projects: readonly ProjectEntry[] = [
  {
    slug: "tcc-engsoftware",
    title: { en: "Financial market analysis with Deep Learning Techniques" },
    summary: {
      en: "The project presented in my undergraduate thesis, covering stock market analysis using LSTM and CNN models, as well as a hybrid between these.",
    },
    description: {
      en: "Undergraduate thesis (Software Engineering, UEPG) that builds and evaluates CNN, LSTM and hybrid CNN+LSTM models to predict the next hourly closing price of Brazilian mini futures (WDO and WIN) from MetaTrader 5 data. It is organized as a reproducible pipeline, contemplating extraction, cleaning, windowing, training, evaluation and backtesting, with one script per experimental scenario. The thesis conclude that none of the five approaches tested produced a statistically reliable directional edge at the one-hour horizon.",
    },
    status: "available",
    technologies: ["python", "tensorflow", "keras", "metatrader5"],
    categories: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "Stock Market",
    ],
    group: "ml",
    repositoryUrl: "https://github.com/dr1co/tcc-engsoftware",
    caseStudy: "tcc-engsoftware",
    featured: true,
  },
  {
    slug: "django-project-template",
    title: { en: "Django Project Template for automated project building" },
    summary: {
      en: "My go-to template for Django projects, featuring integration with tailwind, structured tests, and more!",
    },
    description: {
      en: "A generic Django starter derived from a template I originally built for Princesa dos Campos to standardize their full-stack web projects. It packages the same conventions (Tailwind integration, structured tests, containerized setup) without any company-specific code.",
    },
    status: "available",
    technologies: ["python", "django", "tailwind", "docker", "github-packages"],
    categories: ["DevOps"],
    group: "devops",
    repositoryUrl: "https://github.com/dr1co/django-project-template",
    caseStudy: "django-project-template",
    featured: true,
  },
];

/** Directory groups with their titles in `locale`. */
export function getProjectGroups(locale: Locale): readonly ProjectGroup[] {
  return localize(projectGroups, locale);
}

/** Every project with its texts in `locale`. */
export function getProjects(locale: Locale): readonly Project[] {
  return localize(projects, locale);
}

const MAX_FEATURED = 4;

type Publishable = Pick<Project, "status" | "caseStudy">;

const isPublished = (project: Publishable) => project.status !== "planned";

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
  locale: Locale,
  list: readonly Project[] = getProjects(locale),
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
  locale: Locale,
  list: readonly Project[] = getProjects(locale),
): { group: ProjectGroup; projects: Project[] }[] {
  return getProjectGroups(locale)
    .map((group) => ({
      group,
      projects: list
        .filter((project) => project.group === group.id && isPublished(project))
        .sort(byFeaturedStatusTitle)
        .map(withPublishableLinks),
    }))
    .filter(({ projects }) => projects.length > 0);
}

const hasCaseStudy = (project: Publishable) =>
  isPublished(project) && Boolean(project.caseStudy);

/** Slugs of published projects with a case study (feeds `generateStaticParams`). The same in every locale. */
export function getCaseStudySlugs(
  list: readonly (Publishable & { slug: string })[] = projects,
): string[] {
  return list.filter(hasCaseStudy).map((project) => project.slug);
}

/** The published project with a case study for `slug`, links validated; `undefined` otherwise. */
export function getProject(
  slug: string,
  locale: Locale,
  list: readonly Project[] = getProjects(locale),
): Project | undefined {
  const project = list.find((item) => item.slug === slug);
  return project && hasCaseStudy(project)
    ? withPublishableLinks(project)
    : undefined;
}
