import { FileText } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { localize } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { siteConfig } from "@/lib/site-config";

/**
 * The résumé PDF for `locale`, opened in a new tab. Renders nothing while no file is set.
 * External on purpose: an internal path would get the locale prefix (`/pt-br/resume/…`).
 */
export function ResumeLink({
  locale,
  href = localize(siteConfig.resume, locale),
}: {
  locale: Locale;
  href?: string;
}) {
  if (href === "") return null;
  return (
    <AppLink
      href={href}
      external
      className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
    >
      <FileText aria-hidden className="size-4" />
      {getMessages(locale).about.resume}
    </AppLink>
  );
}
