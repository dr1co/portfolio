import type { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { PipelineSection } from "@/components/home/pipeline-section";
import { SkillsSection } from "@/components/home/skills-section";
import { getLocale } from "@/i18n/server";
import { canonicalFor } from "@/lib/canonical";

export const metadata: Metadata = { alternates: canonicalFor("/") };

export default async function Home() {
  const locale = await getLocale();
  return (
    <>
      <Hero locale={locale} />
      <FeaturedProjects locale={locale} />
      <PipelineSection locale={locale} />
      <SkillsSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
