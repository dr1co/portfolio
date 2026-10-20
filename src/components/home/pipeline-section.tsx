import { FlaskConical } from "lucide-react";
import { PipelinePreview } from "@/components/pipeline/pipeline-preview";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { pipelineStages } from "@/content/pipeline";

/** Simulated delivery pipeline walkthrough, with a static list for visitors without JavaScript. */
export function PipelineSection() {
  return (
    <Section
      id="pipeline"
      eyebrow="// pipeline"
      title="How code reaches production"
      description={
        <p className="flex flex-wrap items-center gap-2">
          <Badge icon={FlaskConical}>Simulated</Badge>
          <span>
            Select a stage to see what it does. This is an illustrative
            walkthrough; it does not run or trigger a real pipeline.
          </span>
        </p>
      }
    >
      <PipelinePreview stages={pipelineStages} />
      <noscript>
        <ol className="flex flex-col gap-4">
          {pipelineStages.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.label}</strong>: {stage.purpose}{" "}
              <code className="font-mono text-sm">
                {stage.command.join(" && ").replaceAll("$ ", "")}
              </code>
            </li>
          ))}
        </ol>
      </noscript>
    </Section>
  );
}
