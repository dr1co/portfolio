"use client";

import {
  FlaskConical,
  GitCommitHorizontal,
  Hammer,
  ListChecks,
  Package,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { Badge } from "@/components/ui/badge";
import type { PipelineStage, StageIcon } from "@/content/pipeline";
import { cn } from "@/lib/cn";
import { useRovingTabs } from "@/lib/use-roving-tabs";

const ICONS: Record<StageIcon, LucideIcon> = {
  commit: GitCommitHorizontal,
  build: Hammer,
  test: ListChecks,
  package: Package,
  deploy: Rocket,
};

/** Select-to-reveal walkthrough of delivery stages: horizontal on desktop, stacked on mobile. Simulated. */
export function PipelinePreview({
  stages,
}: {
  stages: readonly PipelineStage[];
}) {
  const { selected, tabProps } = useRovingTabs(stages.length);
  const stage = stages[selected];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Delivery pipeline stages"
        className="grid gap-3 md:grid-cols-5"
      >
        {stages.map((item, index) => {
          const Icon = ICONS[item.icon];
          const active = index === selected;
          return (
            <button
              key={item.id}
              id={`stage-tab-${item.id}`}
              aria-controls="stage-panel"
              {...tabProps(index)}
              className={cn(
                "relative flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors md:flex-col md:items-start",
                active
                  ? "border-accent bg-surface-elevated font-semibold"
                  : "border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground",
              )}
            >
              <span aria-hidden className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon
                aria-hidden
                className={cn("size-5 shrink-0", active && "text-accent")}
              />
              <span className="text-sm">{item.label}</span>
              {index < stages.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-8 h-3 w-px bg-border md:top-1/2 md:-right-3 md:bottom-auto md:left-auto md:h-px md:w-3"
                />
              )}
              {active && (
                <motion.span
                  layoutId="pipeline-active"
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${stage.id}`}
        tabIndex={0}
        className="rounded-lg focus-visible:outline-offset-4"
      >
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <div>
            <h3 className="text-xl font-semibold">{stage.label}</h3>
            <p className="mt-2 text-lg">{stage.purpose}</p>
            <p className="mt-3 text-muted">{stage.explanation}</p>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <TerminalPanel
              title="pipeline-demo / main"
              lines={stage.command}
              badge={<Badge icon={FlaskConical}>Simulated</Badge>}
              copyable
            />
            <details className="group rounded-lg">
              <summary className="cursor-pointer font-mono text-sm text-muted hover:text-foreground">
                Workflow excerpt
              </summary>
              <div className="mt-3">
                <TerminalPanel
                  title={stage.workflowFile}
                  lines={stage.workflow}
                />
              </div>
            </details>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
