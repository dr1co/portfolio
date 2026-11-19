"use client";

import { usePathname } from "next/navigation";
import { AppLink } from "@/components/ui/app-link";
import { iconButtonClass } from "@/components/ui/icon-button";
import { useLocale, useMessages } from "@/i18n/locale-context";
import { languageTags, locales, stripLocale } from "@/i18n/locales";

/**
 * "PT" / "EN" link to the current page in the other language, named e.g. "PT — Ver em português"
 * (the visible text comes first in the name, WCAG 2.5.3). The href is rendered on the server
 * from the current path, so it works without JavaScript.
 */
export function LanguageSwitch() {
  const locale = useLocale();
  const target = locales.find((candidate) => candidate !== locale)!;
  const t = useMessages().languageSwitch;

  return (
    <AppLink
      href={stripLocale(usePathname())}
      locale={target}
      hrefLang={languageTags[target]}
      lang={languageTags[target]}
      aria-label={`${t.short} — ${t.label}`}
      className={`${iconButtonClass} font-mono text-sm font-semibold`}
    >
      {t.short}
    </AppLink>
  );
}
