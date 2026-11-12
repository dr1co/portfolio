import {
  getCaseStudySlugs,
  getProject,
  getProjectGroups,
} from "@/content/projects";
import { defaultLocale, toLocale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { getSiteConfig } from "@/lib/site-config";

export const alt = getMessages(defaultLocale).og.caseStudyAlt;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const project = getProject(slug, locale);
  const group = getProjectGroups(locale).find(
    (item) => item.id === project?.group,
  );
  const config = getSiteConfig(locale);

  return renderOgImage({
    title: project?.title ?? config.headline,
    subtitle: [
      group?.title ?? getMessages(locale).og.caseStudy,
      config.name,
    ].join(" · "),
    titleSize: 64,
  });
}
