import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MotionProvider } from "@/components/ui/motion-provider";
import { LocaleProvider } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** The `<html>` document every page shares: fonts, providers, header and footer. Used by the root layout and the global 404 page. */
export function SiteDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>
            {"[data-reveal]{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
        <LocaleProvider locale={locale}>
          <ThemeProvider>
            <MotionProvider>
              <SkipLink locale={locale} />
              <SiteHeader locale={locale} />
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <SiteFooter locale={locale} />
            </MotionProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
