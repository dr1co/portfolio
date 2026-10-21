export type NavRoute = {
  href: "/" | "/projects" | "/lab" | "/about";
  label: string;
  enabled: boolean;
};

export type ProfileLinks = {
  github: string;
  linkedin: string;
  email: string;
};

export type SiteConfig = {
  name: string;
  wordmark: string;
  descriptor: string;
  headline: string;
  tagline: string;
  intro: string;
  heroTags: readonly string[];
  routes: readonly NavRoute[];
  links: ProfileLinks;
  sourceRepoUrl: string;
};

/** Site-wide identity, navigation and public links. Empty links are never rendered. */
export const siteConfig: SiteConfig = {
  name: "Adriano Matoba Lipski",
  wordmark: "adriano.dev",
  descriptor: "DevOps & Automation",
  headline: "From code to production.",
  tagline:
    "Building reproducible environments, automated workflows, and reliable software delivery.",
  // TODO(content): review intro wording.
  intro:
    "Software developer working on backend services, containerized development environments and CI/CD automation — currently deepening that work toward DevOps.",
  heroTags: ["Docker", "CI/CD", "Python", "Linux"],
  routes: [
    { href: "/", label: "Home", enabled: true },
    { href: "/projects", label: "Projects", enabled: false },
    { href: "/lab", label: "Lab", enabled: false },
    { href: "/about", label: "About", enabled: false },
  ],
  links: {
    github: "https://github.com/dr1co",
    linkedin: "https://linkedin.com/in/amlipski",
    email: "adrianolipski@gmail.com",
  },
  sourceRepoUrl: "https://github.com/dr1co/portfolio",
};
