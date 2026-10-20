import { isHttpsUrl } from "@/lib/links";

export type ProjectStatus = "available" | "in-progress" | "planned";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  technologies: readonly string[];
  categories: readonly string[];
  repositoryUrl?: string;
  demoUrl?: string;
  caseStudy?: string;
  featured: boolean;
  lastUpdated?: string;
};

// TODO(content): add the public repositories (title, repo URL, one-line summary, honest status).
export const projects: readonly Project[] = [
  {
    slug: 'tcc-engsoftware',
    title: 'Finantial market analysis with Deep Learning Techniques',
    summary: 'The project presented in my undergraduate thesis, covering stock market analysis using LSTM and CNN models, as well as a hybrid between these.',
    description: '',
    status: 'in-progress',
    technologies: ['python', 'pytorch', 'tensorflow', 'keras', 'MetaTrader 5'],
    categories: ['Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Stock Market'],
    repositoryUrl: 'https://github.com/dr1co/tcc-engsoftware',
    featured: true
  }
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
