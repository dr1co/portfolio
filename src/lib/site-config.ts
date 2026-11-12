import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";

export type ProfileLinks = {
  github: string;
  linkedin: string;
  email: string;
};

type SiteConfigEntry = {
  name: string;
  wordmark: string;
  descriptor: Localized;
  headline: Localized;
  tagline: Localized;
  intro: Localized;
  heroTags: readonly string[];
  routes: readonly {
    href: "/" | "/projects" | "/lab" | "/about";
    label: Localized;
    enabled: boolean;
  }[];
  links: ProfileLinks;
  sourceRepoUrl: string;
};

export type SiteConfig = Resolved<SiteConfigEntry>;
export type NavRoute = SiteConfig["routes"][number];

/** Site-wide identity, navigation and public links. Empty links are never rendered. */
export const siteConfig: SiteConfigEntry = {
  name: "Adriano Matoba Lipski",
  wordmark: "adriano.dev",
  descriptor: { en: "DevOps & Automation" },
  headline: { en: "From code to production." },
  tagline: {
    en: "Building reproducible environments, automated workflows, and reliable software delivery.",
  },
  intro: {
    en: "Software Engineer working on backend services, containerized development environments and CI/CD automation. Currently deepening the work toward DevOps & DevSecOps.",
  },
  heroTags: ["Docker", "CI/CD", "Python", "Linux", "Bash"],
  routes: [
    { href: "/", label: { en: "Home" }, enabled: true },
    { href: "/projects", label: { en: "Projects" }, enabled: true },
    { href: "/lab", label: { en: "Lab" }, enabled: true },
    { href: "/about", label: { en: "About" }, enabled: false },
  ],
  links: {
    github: "https://github.com/dr1co",
    linkedin: "https://linkedin.com/in/amlipski",
    email: "adrianolipski@gmail.com",
  },
  sourceRepoUrl: "https://github.com/dr1co/portfolio",
};

/** The site config with its texts in `locale`. */
export function getSiteConfig(locale: Locale): SiteConfig {
  return localize(siteConfig, locale);
}
