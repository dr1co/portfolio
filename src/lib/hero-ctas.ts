import { isHttpsUrl } from "./links";

export type Cta = { label: string; href: string; external?: boolean };

type HeroCtaInput = {
  featuredCount: number;
  githubUrl: string;
  hasContact: boolean;
};

/** Picks hero actions from the content that actually exists: projects → GitHub → pipeline, plus optional contact. */
export function resolveHeroCtas({
  featuredCount,
  githubUrl,
  hasContact,
}: HeroCtaInput): {
  primary: Cta;
  secondary?: Cta;
} {
  const primary: Cta =
    featuredCount > 0
      ? { label: "Explore Projects", href: "#projects" }
      : isHttpsUrl(githubUrl)
        ? { label: "Open GitHub", href: githubUrl, external: true }
        : { label: "See the pipeline", href: "#pipeline" };

  return hasContact
    ? { primary, secondary: { label: "Get in touch", href: "#contact" } }
    : { primary };
}
