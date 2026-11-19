import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

/** First focusable element; jumps keyboard users past the header. */
export function SkipLink({ locale }: { locale: Locale }) {
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      {getMessages(locale).layout.skipLink}
    </a>
  );
}
