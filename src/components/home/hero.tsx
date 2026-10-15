import { FlaskConical } from "lucide-react";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getFeaturedProjects } from "@/content/projects";
import { resolveHeroCtas } from "@/lib/hero-ctas";
import { getContactLinks } from "@/lib/links";
import { siteConfig, type SiteConfig } from "@/lib/site-config";

const EXAMPLE_SESSION = [
  "$ docker compose up -d",
  "✔ Network portfolio_default  Created",
  "✔ Container portfolio-db-1   Started",
  "✔ Container portfolio-app-1  Started",
  "$ curl -s localhost:8000/health",
  '{"status": "ok"}',
];

/** Above-the-fold introduction: headline, intro, core tags, adaptive actions and an example terminal. */
export function Hero({
  config = siteConfig,
  featuredCount = getFeaturedProjects().length,
}: {
  config?: SiteConfig;
  featuredCount?: number;
}) {
  const { primary, secondary } = resolveHeroCtas({
    featuredCount,
    githubUrl: config.links.github,
    hasContact: getContactLinks(config.links).length > 0,
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 dot-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div>
          <p className="font-mono text-sm text-accent">
            {config.name} · {config.descriptor}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            {config.headline}
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted">
            {config.tagline}
          </p>
          <p className="mt-4 max-w-prose">{config.intro}</p>
          <ul
            aria-label="Core technologies"
            className="mt-6 flex flex-wrap gap-2"
          >
            {config.heroTags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primary.href} external={primary.external}>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                href={secondary.href}
                external={secondary.external}
                variant="secondary"
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
        <TerminalPanel
          title="~/portfolio"
          lines={EXAMPLE_SESSION}
          badge={<Badge icon={FlaskConical}>Example</Badge>}
          caption="Example terminal output, not a live system."
        />
      </Container>
    </section>
  );
}
