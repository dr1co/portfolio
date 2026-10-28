import { ArrowLeft, FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import { OutcomeMatrix } from "@/components/lab/outcome-matrix";
import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import {
  ciJobs,
  pipelineIntro,
  pipelineScenarios,
  pipelineScope,
} from "@/content/lab-pipeline";
import { canonicalFor } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "Pipeline Explorer",
  description: pipelineIntro,
  alternates: canonicalFor("/lab/pipeline"),
};

export default function PipelineExplorerPage() {
  return (
    <Container className="py-12 md:py-16">
      <AppLink
        href="/lab"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to the Lab
      </AppLink>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
        Pipeline Explorer
      </h1>
      <div className="mt-4 flex max-w-prose flex-col gap-3 text-lg text-muted">
        <p>
          <Badge icon={FlaskConical} className="mr-2 align-middle">
            Simulated
          </Badge>
          {pipelineIntro}
        </p>
        <p className="text-base">{pipelineScope}</p>
      </div>
      <section aria-labelledby="outcomes-heading" className="mt-12">
        <h2 id="outcomes-heading" className="text-2xl font-semibold">
          Outcomes by scenario
        </h2>
        <div className="mt-6">
          <OutcomeMatrix jobs={ciJobs} scenarios={pipelineScenarios} />
        </div>
      </section>
    </Container>
  );
}
