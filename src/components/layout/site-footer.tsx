import { AppLink } from "@/components/ui/app-link";
import { iconButtonClass } from "@/components/ui/icon-button";
import { contactIcons } from "@/components/ui/contact-icons";
import { Container } from "@/components/ui/container";
import { getBuildInfo } from "@/lib/build-info";
import { getContactLinks, isHttpsUrl } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";
import { BuildVersion } from "./build-version";
import { CopyrightYear } from "./copyright-year";

/** Copyright, stack attribution, optional source link and build version, and contact icons. */
export function SiteFooter() {
  const contactLinks = getContactLinks(siteConfig.links);
  const buildInfo = getBuildInfo();

  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            © <CopyrightYear /> {siteConfig.name}
          </p>
          <p>
            Built with Next.js, TypeScript and Tailwind CSS
            {isHttpsUrl(siteConfig.sourceRepoUrl) && (
              <>
                {" · "}
                <AppLink
                  href={siteConfig.sourceRepoUrl}
                  external
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Source
                </AppLink>
              </>
            )}
            {buildInfo && (
              <>
                {" · "}
                <BuildVersion info={buildInfo} />
              </>
            )}
          </p>
        </div>
        {contactLinks.length > 0 && (
          <ul className="flex items-center gap-1">
            {contactLinks.map((link) => {
              const Icon = contactIcons[link.kind];
              return (
                <li key={link.kind}>
                  <AppLink
                    href={link.href}
                    external={link.kind !== "email"}
                    externalIcon={false}
                    aria-label={link.label}
                    className={iconButtonClass}
                  >
                    <Icon className="size-5" />
                  </AppLink>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </footer>
  );
}
