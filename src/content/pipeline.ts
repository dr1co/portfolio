import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";

// TODO(content): review the "pt-br" translations (drafted, not yet reviewed by the owner).

export type StageIcon = "commit" | "build" | "test" | "package" | "deploy";

type PipelineStageEntry = {
  id: "push" | "build" | "test" | "publish" | "deploy";
  label: Localized;
  icon: StageIcon;
  purpose: Localized;
  explanation: Localized;
  command: readonly string[];
  workflowFile: string;
  workflow: readonly string[];
};

export type PipelineStage = Resolved<PipelineStageEntry>;

export const pipelineStages: readonly PipelineStageEntry[] = [
  {
    id: "push",
    label: { en: "Git Push", "pt-br": "Git Push" },
    icon: "commit",
    purpose: {
      en: "A commit to main, or a pull request, triggers the workflow.",
      "pt-br": "Um commit na main, ou um pull request, dispara o workflow.",
    },
    explanation: {
      en: "Every change enters the pipeline the same way. The trigger is declared in the workflow file, so nothing depends on someone remembering to run a script.",
      "pt-br":
        "Toda mudança entra no pipeline do mesmo jeito. O gatilho é declarado no arquivo do workflow, então nada depende de alguém lembrar de rodar um script.",
    },
    command: ["$ git push origin main"],
    workflowFile: ".github/workflows/ci.yml",
    workflow: ["on:", "  push:", "    branches: [main]", "  pull_request:"],
  },
  {
    id: "build",
    label: { en: "Build", "pt-br": "Build" },
    icon: "build",
    purpose: {
      en: "Build a reproducible image from a pinned base with a multi-stage Dockerfile.",
      "pt-br":
        "Gera uma imagem reproduzível a partir de uma base fixada, com um Dockerfile multi-stage.",
    },
    explanation: {
      en: "The image is the unit that moves through the rest of the pipeline. Pinned base images and a lockfile will always keep two builds of the same commit equivalent.",
      "pt-br":
        "A imagem é a unidade que percorre o resto do pipeline. Imagens base fixadas e um lockfile garantem que dois builds do mesmo commit sejam sempre equivalentes.",
    },
    command: ["$ docker build -t app:$GIT_SHA ."],
    workflowFile: ".github/workflows/ci.yml",
    workflow: [
      "- uses: docker/setup-buildx-action@<pinned-sha>",
      "- run: docker build -t app:${{ github.sha }} .",
    ],
  },
  {
    id: "test",
    label: { en: "Test", "pt-br": "Testes" },
    icon: "test",
    purpose: {
      en: "Run lint and tests inside the built image, so CI tests what ships.",
      "pt-br":
        "Roda o lint e os testes dentro da imagem gerada, para que o CI teste exatamente o que vai para produção.",
    },
    explanation: {
      en: "Testing the image instead of the runner's environment catches missing dependencies and configuration drift before anything is published.",
      "pt-br":
        "Testar a imagem, e não o ambiente do runner, pega dependências faltando e desvios de configuração antes que qualquer coisa seja publicada.",
    },
    command: ["$ docker run --rm app:$GIT_SHA pytest -q"],
    workflowFile: ".github/workflows/ci.yml",
    workflow: ["- run: docker run --rm app:${{ github.sha }} pytest -q"],
  },
  {
    id: "publish",
    label: { en: "Publish Image", "pt-br": "Publicar imagem" },
    icon: "package",
    purpose: {
      en: "Push an immutable, SHA-tagged image to GHCR with least-privilege permissions.",
      "pt-br":
        "Envia ao GHCR uma imagem imutável, marcada com o SHA, usando permissões mínimas.",
    },
    explanation: {
      en: "Tagging by commit SHA makes every deployment traceable to its source. The job only gets the permissions it needs to write packages.",
      "pt-br":
        "Marcar a imagem com o SHA do commit torna cada deploy rastreável até o código de origem. O job recebe apenas as permissões necessárias para escrever pacotes.",
    },
    command: ["$ docker push ghcr.io/<owner>/app:$GIT_SHA"],
    workflowFile: ".github/workflows/release.yml",
    workflow: [
      "permissions:",
      "  contents: read",
      "  packages: write",
      "- uses: docker/login-action@<pinned-sha>",
      "  with:",
      "    registry: ghcr.io",
    ],
  },
  {
    id: "deploy",
    label: { en: "Deploy", "pt-br": "Deploy" },
    icon: "deploy",
    purpose: {
      en: "Pull the exact tagged image on the target and restart, keeping the previous tag for rollback.",
      "pt-br":
        "Baixa no servidor a imagem exata com aquela tag e reinicia, mantendo a tag anterior para rollback.",
    },
    explanation: {
      en: "Deploying a known tag rather than latest means a rollback is just redeploying the previous SHA. A health check should confirm the result.",
      "pt-br":
        "Fazer deploy de uma tag conhecida, e não da latest, significa que um rollback é só refazer o deploy do SHA anterior. Um health check deve confirmar o resultado.",
    },
    command: ["$ docker compose pull", "$ docker compose up -d"],
    workflowFile: ".github/workflows/release.yml",
    workflow: [
      "environment: production",
      '- run: ssh deploy@<host> "IMAGE_TAG=${{ github.sha }} docker compose up -d"',
    ],
  },
];

/** Delivery stages with their texts in `locale`. */
export function getPipelineStages(locale: Locale): readonly PipelineStage[] {
  return localize(pipelineStages, locale);
}
