import { ArrowLeft, FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import { OutcomeMatrix } from "@/components/lab/outcome-matrix";
import { PipelineExplorer } from "@/components/lab/pipeline-explorer";
import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getLabDemos } from "@/content/lab";
import {
  getLabPipeline,
  workflowRunsUrl,
  workflowUrl,
} from "@/content/lab-pipeline";
import { getMessages } from "@/i18n/messages";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/i18n/locales";
import { canonicalFor } from "@/lib/canonical";
import { isHttpsUrl } from "@/lib/links";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: demoTitle(locale),
    description: getLabPipeline(locale).intro,
    alternates: canonicalFor("/lab/pipeline"),
  };
}

function demoTitle(locale: Locale) {
  return getLabDemos(locale).find((demo) => demo.slug === "pipeline")!.title;
}

export default async function PipelineExplorerPage() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const { intro, scope, trigger, jobs, scenarios } = getLabPipeline(locale);
  return (
    <Container className="py-12 md:py-16">
      <AppLink
        href="/lab"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t.explorer.back}
      </AppLink>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
        {demoTitle(locale)}
      </h1>
      <div className="mt-4 flex max-w-prose flex-col gap-3 text-lg text-muted">
        <p>
          <Badge icon={FlaskConical} className="mr-2 align-middle">
            {t.badges.simulated}
          </Badge>
          {intro}
        </p>
        <p className="text-base">
          {scope}
          {isHttpsUrl(workflowRunsUrl) && (
            <>
              {" "}
              <AppLink
                href={workflowRunsUrl}
                external
                className="font-medium text-accent hover:underline"
              >
                {t.explorer.realRuns}
              </AppLink>
            </>
          )}
        </p>
      </div>
      <section aria-labelledby="explorer-heading" className="mt-12">
        <h2 id="explorer-heading" className="text-2xl font-semibold">
          {t.explorer.heading}
        </h2>
        <div className="mt-6">
          <PipelineExplorer
            trigger={trigger}
            jobs={jobs}
            scenarios={scenarios}
            workflowUrl={workflowUrl}
          />
          <noscript>
            <div className="mt-8">
              <OutcomeMatrix
                jobs={jobs}
                scenarios={scenarios}
                locale={locale}
              />
            </div>
          </noscript>
        </div>
      </section>
    </Container>
  );
}
