import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { AboutPipeline } from "./about-pipeline";

/** Home page introduction: the whoami workflow and a link to the full about page. */
export function AboutSection({ locale, age }: { locale: Locale; age: number }) {
  const t = getMessages(locale).about;
  return (
    <Section id="about" eyebrow={t.homeEyebrow} title={t.homeTitle}>
      <AboutPipeline locale={locale} age={age} />
      <AppLink
        href="/about"
        className="mt-8 inline-flex items-center gap-2 font-medium text-accent hover:underline"
      >
        {t.fullStory}
        <ArrowRight aria-hidden className="size-4" />
      </AppLink>
    </Section>
  );
}
