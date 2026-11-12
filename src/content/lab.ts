import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import { workflowUrl } from "./lab-pipeline";

// TODO(content): review the "pt-br" translations (drafted, not yet reviewed by the owner).

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
  "pt-br":
    "Demonstrações interativas de como meu software é entregue. Cada uma informa se roda com dados roteirizados ou com um serviço real.",
};

export const labDemos: readonly LabDemoEntry[] = [
  {
    slug: "pipeline",
    title: { en: "Pipeline Explorer", "pt-br": "Explorador de Pipeline" },
    summary: {
      en: "Step through the CI/CD workflow that builds, tests and deploys this site.",
      "pt-br":
        "Percorra, passo a passo, o workflow de CI/CD que gera, testa e publica este site.",
    },
    objective: {
      en: "See how job dependencies and conditions decide what runs, what gets skipped and what a failure stops.",
      "pt-br":
        "Veja como as dependências e condições dos jobs decidem o que roda, o que é ignorado e o que uma falha interrompe.",
    },
    concepts: [
      { en: "Job dependencies", "pt-br": "Dependências entre jobs" },
      { en: "Event conditions", "pt-br": "Condições por evento" },
      { en: "Quality gates", "pt-br": "Quality gates" },
      { en: "Immutable images", "pt-br": "Imagens imutáveis" },
      { en: "Preview vs. production", "pt-br": "Preview vs. produção" },
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
