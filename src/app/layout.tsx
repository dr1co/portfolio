import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MotionProvider } from "@/components/ui/motion-provider";
import { getMissingLinks } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const defaultTitle = `${siteConfig.name} — ${siteConfig.descriptor}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: { default: defaultTitle, template: `%s · ${siteConfig.name}` },
  description: siteConfig.tagline,
  robots: { index: allowIndexing, follow: allowIndexing },
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.wordmark,
    title: defaultTitle,
    description: siteConfig.tagline,
  },
  twitter: { card: "summary_large_image" },
};

if (process.env.NODE_ENV === "development") {
  const missing = getMissingLinks(siteConfig.links);
  if (missing.length > 0) {
    console.warn(
      `[site-config] Links not rendered (empty or invalid): ${missing.join(", ")}`,
    );
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>
            {"[data-reveal]{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
        <ThemeProvider>
          <MotionProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
