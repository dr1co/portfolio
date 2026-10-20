import { AppLink } from "@/components/ui/app-link";
import { contactIcons } from "@/components/ui/contact-icons";
import { Section } from "@/components/ui/section";
import { getContactLinks, type ContactLink } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";

/** Configured contact channels as large tappable rows; renders nothing when none are set. */
export function ContactSection({
  links = getContactLinks(siteConfig.links),
}: {
  links?: readonly ContactLink[];
}) {
  if (links.length === 0) return null;

  return (
    <Section
      id="contact"
      eyebrow="// contact"
      title="Get in touch"
      description="Reach out through any of these channels."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const Icon = contactIcons[link.kind];
          return (
            <li key={link.kind}>
              <AppLink
                href={link.href}
                external={link.kind !== "email"}
                className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/50 hover:bg-surface-elevated"
              >
                <Icon className="size-6 shrink-0 text-accent" />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{link.label}</span>
                  <span className="truncate font-mono text-sm text-muted">
                    {link.display}
                  </span>
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
