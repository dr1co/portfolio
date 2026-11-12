import { locales, toLocale } from "@/i18n/locales";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { getSiteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** One image per locale, so its `alt` text is in the page's language. */
export function generateImageMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { name, descriptor } = getSiteConfig(toLocale(params.lang));
  return [
    {
      id: "default",
      alt: `${name} — ${descriptor}`,
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { name, headline, descriptor } = getSiteConfig(
    toLocale((await params).lang),
  );
  return renderOgImage({
    title: headline,
    subtitle: `${name} · ${descriptor}`,
  });
}
