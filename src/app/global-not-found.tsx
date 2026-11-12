import { NotFoundView } from "@/components/layout/not-found-view";
import { SiteDocument } from "@/components/layout/site-document";
import { defaultLocale } from "@/i18n/locales";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata(defaultLocale);

/** 404 for URLs no route matches (including the proxy's `UNROUTED_PATH`). It renders outside `app/[lang]`. */
export default function GlobalNotFound() {
  return (
    <SiteDocument locale={defaultLocale}>
      <NotFoundView locale={defaultLocale} />
    </SiteDocument>
  );
}
