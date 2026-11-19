import type { Metadata } from "next";
import { AboutSection } from "@/components/about/about-section";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { PipelineSection } from "@/components/home/pipeline-section";
import { SkillsSection } from "@/components/home/skills-section";
import { getLocale } from "@/i18n/server";
import { age } from "@/lib/age";
import { canonicalFor } from "@/lib/canonical";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: canonicalFor("/", await getLocale()) };
}

export default async function Home() {
  const locale = await getLocale();
  const years = await age(siteConfig.birthMonth);
  return (
    <>
      <Hero locale={locale} />
      <AboutSection locale={locale} age={years} />
      <FeaturedProjects locale={locale} />
      <PipelineSection locale={locale} />
      <SkillsSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
