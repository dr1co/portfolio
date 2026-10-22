"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string };

/**
 * Navigation link with underline + strong text when current: `aria-current="page"` on its own route,
 * `aria-current="true"` on pages inside its section (e.g. Projects on a case study).
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
  const pathname = usePathname();
  const ariaCurrent =
    pathname === href
      ? "page"
      : href !== "/" && pathname.startsWith(`${href}/`)
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
