import { lang } from "next/root-params";
import { SiteDocument } from "@/components/layout/site-document";
import { locales } from "@/i18n/locales";
import { getMissingLinks } from "@/lib/links";
import { siteConfig } from "@/lib/site-config";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

if (process.env.NODE_ENV === "development") {
  const missing = getMissingLinks(siteConfig.links);
  if (missing.length > 0) {
    console.warn(
      `[site-config] Links not rendered (empty or invalid): ${missing.join(", ")}`,
    );
  }
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return <SiteDocument lang={await lang()}>{children}</SiteDocument>;
}
