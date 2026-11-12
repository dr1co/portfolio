"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { stripLocale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string };

/**
 * Navigation link with underline + strong text when current: `aria-current="page"` on its own route,
 * `aria-current="true"` on pages inside its section (e.g. Projects on a case study).
 * Prerendered pages report their internal `/en/...` path, so both sides are compared without the locale.
 */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = stripLocale(usePathname());
  const target = stripLocale(href);
  const ariaCurrent =
    pathname === target
      ? "page"
      : target !== "/" && pathname.startsWith(`${target}/`)
        ? "true"
        : undefined;
  const current = ariaCurrent !== undefined;
  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      aria-current={ariaCurrent}
      className={cn(
        "text-sm font-medium underline-offset-8 transition-colors hover:text-foreground",
        current
          ? "text-foreground underline decoration-accent decoration-2"
          : "text-muted",
        className,
      )}
    >
      {children}
    </AppLink>
  );
}
