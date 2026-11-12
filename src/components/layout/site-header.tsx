import { MobileNav } from "@/components/navigation/mobile-nav";
import { iconButtonClass } from "@/components/ui/icon-button";
import { NavLink, type NavItem } from "@/components/navigation/nav-link";
import { Wordmark } from "@/components/navigation/wordmark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppLink } from "@/components/ui/app-link";
import { contactIcons } from "@/components/ui/contact-icons";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { getContactLinks, getEnabledRoutes } from "@/lib/links";
import { getSiteConfig } from "@/lib/site-config";

/** Sticky top bar: wordmark, enabled routes, contact shortcut, GitHub and theme toggle. */
export function SiteHeader({ locale }: { locale: Locale }) {
  const config = getSiteConfig(locale);
  const t = getMessages(locale).layout;
  const contactLinks = getContactLinks(config.links, locale);
  const github = contactLinks.find((link) => link.kind === "github");
  const items: NavItem[] = [
    ...getEnabledRoutes(config.routes),
    ...(contactLinks.length > 0
      ? [{ href: "/#contact", label: t.contact }]
      : []),
  ];
  const GitHubIcon = contactIcons.github;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Wordmark locale={locale} />
        <div className="flex items-center gap-2 md:gap-6">
          <nav aria-label={t.mainNav} className="hidden md:block">
            <ul className="flex items-center gap-6">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            {github && (
              <AppLink
                href={github.href}
                external
                externalIcon={false}
                aria-label={t.githubProfile}
                className={iconButtonClass}
              >
                <GitHubIcon className="size-5" />
              </AppLink>
            )}
            <ThemeToggle />
            {items.length > 1 && <MobileNav items={items} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
