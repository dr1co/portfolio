import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import { workflowUrl } from "./lab-pipeline";

type LabDemoEntry = {
  slug: string;
  title: Localized;
  summary: Localized;
  objective: Localized;
  concepts: readonly Localized[];
  /** Whether the demo runs on scripted data or talks to a real service. */
  mode: "simulated" | "live";
  prerequisites?: Localized;
  href: `/lab/${string}`;
  sourceUrl?: string;
};

export type LabDemo = Resolved<LabDemoEntry>;

export const labIntro: Localized = {
  en: "Interactive demos of how my software gets delivered. Each one says whether it runs on scripted data or a real service.",
};

export const labDemos: readonly LabDemoEntry[] = [
  {
    slug: "pipeline",
    title: { en: "Pipeline Explorer" },
    summary: {
      en: "Step through the CI/CD workflow that builds, tests and deploys this site.",
    },
    objective: {
      en: "See how job dependencies and conditions decide what runs, what gets skipped and what a failure stops.",
    },
    concepts: [
      { en: "Job dependencies" },
      { en: "Event conditions" },
      { en: "Quality gates" },
      { en: "Immutable images" },
      { en: "Preview vs. production" },
    ],
    mode: "simulated",
    href: "/lab/pipeline",
    sourceUrl: workflowUrl,
  },
];

/** Lab demos with their texts in `locale`. */
export function getLabDemos(locale: Locale): readonly LabDemo[] {
  return localize(labDemos, locale);
}
