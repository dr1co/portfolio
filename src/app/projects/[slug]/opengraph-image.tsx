import {
  getCaseStudySlugs,
  getProject,
  projectGroups,
} from "@/content/projects";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { siteConfig } from "@/lib/site-config";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  const group = projectGroups.find((item) => item.id === project?.group);

  return renderOgImage({
    title: project?.title ?? siteConfig.headline,
    subtitle: [group?.title ?? "Case study", siteConfig.name].join(" · "),
    titleSize: 64,
  });
}
