import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { isHttpsUrl } from "./links";

export type Cta = { label: string; href: string; external?: boolean };

type HeroCtaInput = {
  featuredCount: number;
  githubUrl: string;
  hasContact: boolean;
  locale: Locale;
};

/** Picks hero actions from the content that actually exists: projects → GitHub → pipeline, plus optional contact. */
export function resolveHeroCtas({
  featuredCount,
  githubUrl,
  hasContact,
  locale,
}: HeroCtaInput): {
  primary: Cta;
  secondary?: Cta;
} {
  const t = getMessages(locale).hero;
  const primary: Cta =
    featuredCount > 0
      ? { label: t.exploreProjects, href: "#projects" }
      : isHttpsUrl(githubUrl)
        ? { label: t.openGithub, href: githubUrl, external: true }
        : { label: t.seePipeline, href: "#pipeline" };

  return hasContact
    ? { primary, secondary: { label: t.getInTouch, href: "#contact" } }
    : { primary };
}
