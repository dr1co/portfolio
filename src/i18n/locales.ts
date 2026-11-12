/** Supported locales. The default one is served without a URL prefix. */
export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Narrows a route segment to a supported locale. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A path without its leading locale segment, e.g. `/en/lab` → `/lab`. Paths without one are returned as is. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first)) return pathname;
  return `/${rest.join("/")}`.replace(/\/$/, "") || "/";
}
