import { NotFoundView } from "@/components/layout/not-found-view";
import { SiteDocument } from "@/components/layout/site-document";
import { defaultLocale } from "@/i18n/locales";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

/** 404 for URLs no route matches (including the proxy's `UNROUTED_PATH`). It renders outside `app/[lang]`. */
export default function GlobalNotFound() {
  return (
    <SiteDocument lang={defaultLocale}>
      <NotFoundView />
    </SiteDocument>
  );
}
