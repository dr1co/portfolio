import { defaultLocale, locales, toLocale } from "@/i18n/locales";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig(defaultLocale);

export const alt = `${config.name} — ${config.descriptor}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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
