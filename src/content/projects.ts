import { isHttpsUrl } from "@/lib/links";
import type { TechnologyId } from "./technologies";

export type ProjectStatus = "available" | "in-progress" | "planned";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  technologies: readonly TechnologyId[];
  categories: readonly string[];
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
    technologies: ["python", "pytorch", "tensorflow", "keras", "metatrader5"],    categories: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "Stock Market",
    ],
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
    repositoryUrl: "https://github.com/dr1co/django-project-template",
    featured: true,
  },
];

const MAX_FEATURED = 4;

/** Featured projects that are ready to show: not planned, capped at four, unpublishable links removed. */
export function getFeaturedProjects(
  list: readonly Project[] = projects,
): Project[] {
  return list
    .filter((project) => project.featured && project.status !== "planned")
    .slice(0, MAX_FEATURED)
    .map((project) => ({
      ...project,
      repositoryUrl: isHttpsUrl(project.repositoryUrl)
        ? project.repositoryUrl
        : undefined,
      demoUrl: isHttpsUrl(project.demoUrl) ? project.demoUrl : undefined,
    }));
}
