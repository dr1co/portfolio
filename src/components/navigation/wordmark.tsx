import { AppLink } from "@/components/ui/app-link";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { siteConfig } from "@/lib/site-config";

/** Text wordmark with a terminal cursor; links home. */
export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <AppLink
      href="/"
      aria-label={getMessages(locale).layout.home(siteConfig.wordmark)}
      className="font-mono text-base font-semibold"
    >
      {siteConfig.wordmark}
      <span aria-hidden className="cursor-blink text-accent">
        _
      </span>
    </AppLink>
  );
}
