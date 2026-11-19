import type { Metadata } from "next";
import { LabCard } from "@/components/lab/lab-card";
import { Container } from "@/components/ui/container";
import { getLabDemos, labIntro } from "@/content/lab";
import { localize } from "@/i18n/localize";
import { getMessages } from "@/i18n/messages";
import { getLocale } from "@/i18n/server";
import { canonicalFor } from "@/lib/canonical";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: getMessages(locale).lab.title,
    description: localize(labIntro, locale),
    alternates: canonicalFor("/lab", locale),
  };
}

export default async function LabPage() {
  const locale = await getLocale();
  const t = getMessages(locale).lab;
  return (
    <Container className="py-16 md:py-20">
      <p className="font-mono text-sm text-accent">{t.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        {localize(labIntro, locale)}
      </p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {getLabDemos(locale).map((demo) => (
          <li key={demo.slug}>
            <LabCard demo={demo} locale={locale} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
