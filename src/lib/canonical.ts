import type { Metadata } from "next";
import {
  defaultLocale,
  languageTags,
  locales,
  localizePath,
  type Locale,
} from "@/i18n/locales";

/** The page at `path` (unprefixed) in every language, keyed by BCP 47 tag, plus `x-default` (the default locale). */
export function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries([
    ...locales.map((locale) => [
      languageTags[locale],
      localizePath(path, locale),
    ]),
    ["x-default", localizePath(path, defaultLocale)],
  ]);
}

/**
 * `alternates` for a page: its canonical URL in `locale` and its `hreflang` translations, or undefined
 * until `NEXT_PUBLIC_SITE_URL` is set. Every page sets its own: metadata merges shallowly, so alternates
 * set higher up would leak into child pages.
 */
export function canonicalFor(
  path: string,
  locale: Locale,
  siteUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): Metadata["alternates"] {
  if (!siteUrl) return undefined;
  return {
    canonical: localizePath(path, locale),
    languages: languageAlternates(path),
  };
}
