import {
  getCaseStudySlugs,
  getProject,
  getProjectGroups,
} from "@/content/projects";
import { toLocale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { getSiteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

/** One image per case study and locale, so its `alt` text is in the page's language. */
export function generateImageMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const locale = toLocale(params.lang);
  const project = getProject(params.slug, locale);
  const caseStudy = getMessages(locale).og.caseStudy;
  return [
    {
      id: "default",
      alt: project ? `${caseStudy}: ${project.title}` : caseStudy,
      size: ogSize,
      contentType: "image/png",
    },
  ];
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
