"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useLocale, useMessages } from "@/i18n/locale-context";
import { localizePath, type Locale } from "@/i18n/locales";

export type AppLinkProps = {
  href: string;
  external?: boolean;
  externalIcon?: boolean;
  className?: string;
  children: ReactNode;
  /** Language of an internal target; the current page's by default. */
  locale?: Locale;
} & Pick<
  ComponentProps<typeof Link>,
  "onNavigate" | "aria-label" | "aria-current" | "hrefLang" | "lang"
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
  locale: targetLocale,
  ...props
}: AppLinkProps) {
  const currentLocale = useLocale();
  const t = useMessages().layout;

  if (!external) {
    return (
      <Link
        href={localizePath(href, targetLocale ?? currentLocale)}
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
