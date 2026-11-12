import { defaultLocale, type Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import type { NavRoute, ProfileLinks } from "./site-config";

export type ContactLink = {
  kind: keyof ProfileLinks;
  label: string;
  href: string;
  display: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True for absolute `https:` URLs; anything else is treated as unpublishable. */
export function isHttpsUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function displayUrl(url: string): string {
  const { hostname, pathname } = new URL(url);
  return `${hostname.replace(/^www\./, "")}${pathname}`.replace(/\/$/, "");
}

/** Valid, publishable contact links in a fixed order (GitHub, LinkedIn, Email), labelled in `locale`. */
export function getContactLinks(
  links: ProfileLinks,
  locale: Locale,
): ContactLink[] {
  const labels = getMessages(locale).contactLabels;
  const profiles = ["github", "linkedin"] as const;
  const result: ContactLink[] = profiles
    .filter((kind) => isHttpsUrl(links[kind]))
    .map((kind) => ({
      kind,
      label: labels[kind],
      href: links[kind],
      display: displayUrl(links[kind]),
    }));
  if (EMAIL_PATTERN.test(links.email)) {
    result.push({
      kind: "email",
      label: labels.email,
      href: `mailto:${links.email}`,
      display: links.email,
    });
  }
  return result;
}

/** Profile link keys that would not be rendered because they are empty or invalid. */
export function getMissingLinks(links: ProfileLinks): (keyof ProfileLinks)[] {
  const present = new Set(
    getContactLinks(links, defaultLocale).map((link) => link.kind),
  );
  return (Object.keys(links) as (keyof ProfileLinks)[]).filter(
    (kind) => !present.has(kind),
  );
}

type Route = Pick<NavRoute, "href" | "enabled">;

/** Navigation routes that are switched on in the site config. */
export function getEnabledRoutes<R extends Route>(routes: readonly R[]): R[] {
  return routes.filter((route) => route.enabled);
}

/** Whether the route at `href` exists and is switched on. */
export function isRouteEnabled(
  routes: readonly Route[],
  href: NavRoute["href"],
): boolean {
  return getEnabledRoutes(routes).some((route) => route.href === href);
}
