/** Supported locales. The default one is served without a URL prefix. */
export const locales = ["en", "pt-br"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Narrows a route segment to a supported locale. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A route segment as a locale, falling back to the default one. */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** A path without its leading locale segment, e.g. `/en/lab` → `/lab`. Paths without one are returned as is. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first)) return pathname;
  return `/${rest.join("/")}`.replace(/\/$/, "") || "/";
}

/** Tag for `Intl` formatters in each locale. */
export const intlLocales: Record<Locale, string> = {
  en: "en-US",
  "pt-br": "pt-BR",
};

/** BCP 47 tag for `<html lang>` and `hreflang` in each locale. */
export const languageTags: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
};

/** The public URL of an internal path in `locale`, e.g. `/lab` in the default locale stays `/lab`. Other hrefs are returned as is. */
export function localizePath(href: string, locale: Locale): string {
  if (locale === defaultLocale || !href.startsWith("/")) return href;
  const [, path, rest] = /^([^?#]*)(.*)$/.exec(href)!;
  return `/${locale}${path === "/" ? "" : path}${rest}`;
}
