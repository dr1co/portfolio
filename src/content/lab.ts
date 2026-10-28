import { siteConfig } from "@/lib/site-config";
import { workflowPath } from "./lab-pipeline";

export type LabDemo = {
  slug: string;
  title: string;
  summary: string;
  objective: string;
  concepts: readonly string[];
  /** Whether the demo runs on scripted data or talks to a real service. */
  mode: "simulated" | "live";
  prerequisites?: string;
  href: `/lab/${string}`;
  sourceUrl?: string;
};

// TODO(content): review the Lab intro and demo copy.
export const labIntro =
  "Interactive demos of how software gets delivered. Each one says whether it runs on scripted data or a real service.";

export const labDemos: readonly LabDemo[] = [
  {
    slug: "pipeline",
    title: "Pipeline Explorer",
    summary:
      "Step through the CI/CD workflow that builds, tests and deploys this site.",
    objective:
      "See how job dependencies and conditions decide what runs, what gets skipped and what a failure stops.",
    concepts: [
      "Job dependencies",
      "Event conditions",
      "Quality gates",
      "Immutable images",
      "Preview vs. production",
    ],
    mode: "simulated",
    href: "/lab/pipeline",
    sourceUrl: `${siteConfig.sourceRepoUrl}/blob/main/${workflowPath}`,
  },
];
