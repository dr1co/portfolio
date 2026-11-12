import type { Metadata } from "next";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { Container } from "@/components/ui/container";
import { directoryIntro, getProjectDirectory } from "@/content/projects";
import { localize } from "@/i18n/localize";
import { getMessages } from "@/i18n/messages";
import { getLocale } from "@/i18n/server";
import { canonicalFor } from "@/lib/canonical";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: getMessages(locale).projects.title,
    description: localize(directoryIntro, locale),
    alternates: canonicalFor("/projects"),
  };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = getMessages(locale).projects;
  return (
    <>
      <Container className="py-16 md:py-20">
        <p className="font-mono text-sm text-accent">{t.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">
          {localize(directoryIntro, locale)}
        </p>
      </Container>
      <ProjectDirectory
        directory={getProjectDirectory(locale)}
        locale={locale}
      />
    </>
  );
}
