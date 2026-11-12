"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useLocale, useMessages } from "@/i18n/locale-context";
import { localizePath } from "@/i18n/locales";

export type AppLinkProps = {
  href: string;
  external?: boolean;
  externalIcon?: boolean;
  className?: string;
  children: ReactNode;
} & Pick<
  ComponentProps<typeof Link>,
  "onNavigate" | "aria-label" | "aria-current"
>;

/**
 * Single entry point for links: `next/link` for internal targets, a safe new-tab anchor for external ones.
 * Internal paths stay in the page's language, so pass them without a locale (`/projects`).
 */
export function AppLink({
  href,
  external,
  externalIcon = true,
  onNavigate,
  children,
  ...props
}: AppLinkProps) {
  const locale = useLocale();
  const t = useMessages().layout;

  if (!external) {
    return (
      <Link
        href={localizePath(href, locale)}
        onNavigate={onNavigate}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      {externalIcon && (
        <ArrowUpRight
          aria-hidden
          className="inline size-4 shrink-0 align-text-bottom"
        />
      )}
      <span className="sr-only"> {t.newTab}</span>
    </a>
  );
}
