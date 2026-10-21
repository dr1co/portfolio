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

/** Valid, publishable contact links in a fixed order (GitHub, LinkedIn, Email). */
export function getContactLinks(links: ProfileLinks): ContactLink[] {
  const profiles = [
    { kind: "github", label: "GitHub" },
    { kind: "linkedin", label: "LinkedIn" },
  ] as const;
  const result: ContactLink[] = profiles
    .filter(({ kind }) => isHttpsUrl(links[kind]))
    .map(({ kind, label }) => ({
      kind,
      label,
      href: links[kind],
      display: displayUrl(links[kind]),
    }));
  if (EMAIL_PATTERN.test(links.email)) {
    result.push({
      kind: "email",
      label: "Email",
      href: `mailto:${links.email}`,
      display: links.email,
    });
  }
  return result;
}

/** Profile link keys that would not be rendered because they are empty or invalid. */
export function getMissingLinks(links: ProfileLinks): (keyof ProfileLinks)[] {
  const present = new Set(getContactLinks(links).map((link) => link.kind));
  return (Object.keys(links) as (keyof ProfileLinks)[]).filter(
    (kind) => !present.has(kind),
  );
}

/** Navigation routes that are switched on in the site config. */
export function getEnabledRoutes(routes: readonly NavRoute[]): NavRoute[] {
  return routes.filter((route) => route.enabled);
}

/** Whether the route at `href` exists and is switched on. */
export function isRouteEnabled(
  routes: readonly NavRoute[],
  href: NavRoute["href"],
): boolean {
  return getEnabledRoutes(routes).some((route) => route.href === href);
}
