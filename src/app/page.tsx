import { ContactSection } from "@/components/home/contact-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { PipelineSection } from "@/components/home/pipeline-section";
import { SkillsSection } from "@/components/home/skills-section";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <PipelineSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
