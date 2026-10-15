"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string };

/** Navigation link that marks itself `aria-current="page"` (underline + strong text) on its own route. */
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
  const current = usePathname() === href;
  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      aria-current={current ? "page" : undefined}
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
