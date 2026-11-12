import { localize, type Localized, type Resolved } from "@/i18n/localize";
import { defaultLocale, type Locale } from "@/i18n/locales";
import { isHttpsUrl } from "@/lib/links";
import type { TechnologyId } from "./technologies";

export type ProjectStatus = "available" | "in-progress" | "planned";

/** Intro shown on the /projects directory page and used as its meta description. */
export const directoryIntro: Localized = {
  en: "Things I have built, grouped by area. Each card says what exists today and links to the source. Projects with a case study shows a deep dive into the decisions behind them.",
  "pt-br":
    "Coisas que construí, agrupadas por área. Cada card diz o que já existe hoje e leva ao código-fonte. Projetos com estudo de caso trazem um mergulho nas decisões por trás deles.",
};

/** Directory groups, in display order. */
export const projectGroups = [
  {
    id: "devops",
    title: { en: "DevOps and Delivery", "pt-br": "DevOps e Entrega" },
  },
  {
    id: "backend",
    title: { en: "Backend and Automation", "pt-br": "Backend e Automação" },
  },
  {
    id: "ml",
    title: {
      en: "Machine Learning and AI",
      "pt-br": "Aprendizado de Máquina e IA",
    },
  },
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
    title: {
      en: "Financial market analysis with Deep Learning Techniques",
      "pt-br": "Análise de mercado financeiro com técnicas de Deep Learning",
    },
    summary: {
      en: "The project presented in my undergraduate thesis, covering stock market analysis using LSTM and CNN models, as well as a hybrid between these.",
      "pt-br":
        "O projeto apresentado no meu TCC, que analisa o mercado de ações com modelos LSTM e CNN, além de um híbrido entre os dois.",
    },
    description: {
      en: "Undergraduate thesis (Software Engineering, UEPG) that builds and evaluates CNN, LSTM and hybrid CNN+LSTM models to predict the next hourly closing price of Brazilian mini futures (WDO and WIN) from MetaTrader 5 data. It is organized as a reproducible pipeline, contemplating extraction, cleaning, windowing, training, evaluation and backtesting, with one script per experimental scenario. The thesis conclude that none of the five approaches tested produced a statistically reliable directional edge at the one-hour horizon.",
      "pt-br":
        "Trabalho de conclusão de curso (Engenharia de Software, UEPG) que constrói e avalia modelos CNN, LSTM e híbridos CNN+LSTM para prever o próximo preço de fechamento horário dos minicontratos futuros brasileiros (WDO e WIN) a partir de dados do MetaTrader 5. Ele é organizado como um pipeline reproduzível, contemplando extração, limpeza, janelamento, treinamento, avaliação e backtesting, com um script por cenário experimental. O trabalho conclui que nenhuma das cinco abordagens testadas produziu uma vantagem direcional estatisticamente confiável no horizonte de uma hora.",
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
    title: {
      en: "Django Project Template for automated project building",
      "pt-br":
        "Template de projeto Django para criação automatizada de projetos",
    },
    summary: {
      en: "My go-to template for Django projects, featuring integration with tailwind, structured tests, and more!",
      "pt-br":
        "Meu template padrão para projetos Django, com integração ao Tailwind, testes estruturados e mais!",
    },
    description: {
      en: "A generic Django starter derived from a template I originally built for Princesa dos Campos to standardize their full-stack web projects. It packages the same conventions (Tailwind integration, structured tests, containerized setup) without any company-specific code.",
      "pt-br":
        "Um ponto de partida genérico para Django, derivado de um template que criei originalmente para a Princesa dos Campos para padronizar seus projetos web full-stack. Ele reúne as mesmas convenções (integração com Tailwind, testes estruturados, setup em containers) sem nenhum código específico da empresa.",
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

/** The MDX file (without `.mdx`) holding case study `name` in `locale`, e.g. `thesis.pt-br`. */
export function caseStudyFile(name: string, locale: Locale): string {
  return locale === defaultLocale ? name : `${name}.${locale}`;
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
