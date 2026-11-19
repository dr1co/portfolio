import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import { siteConfig } from "@/lib/site-config";

export type RunState = "pending" | "running" | "passed" | "failed" | "skipped";

/** The workflow events the Lab models. Pull requests are same-repository ones; forks aren't modeled. */
export type PipelineEvent = "push-main" | "pull-request";

export type LabIcon =
  | "trigger"
  | "checks"
  | "browser"
  | "container"
  | "package"
  | "preview"
  | "deploy";

export type CiJobId =
  | "quality"
  | "e2e"
  | "image"
  | "publish"
  | "deploy-preview"
  | "deploy-production";

export type CiStep = {
  name: string;
  /** Runs only when an earlier step failed (`if: failure()`). */
  onFailure?: true;
  /** Runs only on these events; every event when absent. */
  events?: readonly PipelineEvent[];
};

type CiJobEntry = {
  id: CiJobId;
  label: Localized;
  icon: LabIcon;
  needs: readonly CiJobId[];
  events: readonly PipelineEvent[];
  purpose: Localized;
  explanation: Localized;
  steps: readonly CiStep[];
  /** Lines quoted verbatim from ci.yml; `# …` marks omitted lines. */
  excerpt: readonly string[];
};

type PipelineTriggerEntry = {
  label: Localized;
  icon: LabIcon;
  purpose: Localized;
  explanation: Localized;
  excerpt: readonly string[];
};

type ScenarioEntry = {
  id: "push-main" | "pull-request" | "failure-main" | "vulnerable-image";
  label: Localized;
  summary: Localized;
  event: PipelineEvent;
  failure?: { job: CiJobId; step: string; reason: Localized };
};

export type CiJob = Resolved<CiJobEntry>;
export type PipelineTrigger = Resolved<PipelineTriggerEntry>;
export type Scenario = Resolved<ScenarioEntry>;

export const workflowPath = ".github/workflows/ci.yml";
export const workflowUrl = `${siteConfig.sourceRepoUrl}/blob/main/${workflowPath}`;
export const workflowRunsUrl = `${siteConfig.sourceRepoUrl}/actions/workflows/ci.yml`;

export const pipelineIntro: Localized = {
  en: "This is the CI/CD workflow that builds, tests and deploys this site, modeled job by job. Outcomes are scripted from the real workflow. This is simulated, so nothing here triggers anything.",
  "pt-br":
    "Este é o workflow de CI/CD que gera, testa e publica este site, modelado job a job. Os resultados são roteirizados a partir do workflow real. É uma simulação, então nada aqui dispara coisa alguma.",
};

export const pipelineScope: Localized = {
  en: "A simplified model: runs that get cancelled, pull requests from forks and real durations aren't shown here.",
  "pt-br":
    "Um modelo simplificado: execuções canceladas, pull requests de forks e durações reais não aparecem aqui.",
};

export const pipelineTrigger: PipelineTriggerEntry = {
  label: { en: "Trigger", "pt-br": "Gatilho" },
  icon: "trigger",
  purpose: {
    en: "A push to main or a pull request starts the workflow.",
    "pt-br": "Um push na main ou um pull request inicia o workflow.",
  },
  explanation: {
    en: "Both events run the same file. Conditions on each job decide what happens next: pull requests get a preview, only main gets published and deployed to production.",
    "pt-br":
      "Os dois eventos executam o mesmo arquivo. As condições de cada job decidem o que acontece em seguida: pull requests ganham um preview, e só a main é publicada e enviada para produção.",
  },
  excerpt: ["on:", "  pull_request:", "  push:", "    branches: [main]"],
};

export const ciJobs: readonly CiJobEntry[] = [
  {
    id: "quality",
    label: { en: "Quality", "pt-br": "Qualidade" },
    icon: "checks",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose: {
      en: "Lint, typecheck, format check and unit tests, plus linters for the workflows and the Dockerfile.",
      "pt-br":
        "Lint, checagem de tipos, checagem de formatação e testes unitários, além de linters para os workflows e o Dockerfile.",
    },
    explanation: {
      en: "The fastest feedback runs first and in parallel with the slower jobs. The CI configuration itself is linted, so a broken workflow fails here instead of at deploy time.",
      "pt-br":
        "O feedback mais rápido vem primeiro, em paralelo com os jobs mais lentos. A própria configuração do CI passa por lint, então um workflow quebrado falha aqui ao invés de falhar na hora do deploy.",
    },
    steps: [
      { name: "actions/checkout" },
      { name: "./.github/actions/setup" },
      { name: "Lint" },
      { name: "Generate route types" },
      { name: "Typecheck" },
      { name: "Format check" },
      { name: "Unit tests" },
      { name: "Lint workflows (actionlint)" },
      { name: "Lint Dockerfile (hadolint)" },
    ],
    excerpt: [
      "quality:",
      "  runs-on: ubuntu-24.04",
      "  steps:",
      "    # …",
      "    - name: Lint",
      "      run: npm run lint",
      "    # …",
      "    - name: Typecheck",
      "      run: npm run typecheck",
      "    # …",
      "    - name: Unit tests",
      "      run: npm test",
    ],
  },
  {
    id: "e2e",
    label: { en: "E2E tests", "pt-br": "Testes E2E" },
    icon: "browser",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose: {
      en: "Build the site and run the Playwright suite in a real browser, including accessibility checks.",
      "pt-br":
        "Gera o site e roda a suíte do Playwright em um navegador real, incluindo verificações de acessibilidade.",
    },
    explanation: {
      en: "When a test fails, the Playwright report is uploaded as an artifact, so the failure can be inspected without rerunning it locally.",
      "pt-br":
        "Quando um teste falha, o relatório do Playwright é enviado como artefato, para que a falha possa ser analisada sem rodar tudo de novo localmente.",
    },
    steps: [
      { name: "actions/checkout" },
      { name: "./.github/actions/setup" },
      { name: "End-to-end tests" },
      { name: "Upload Playwright report", onFailure: true },
    ],
    excerpt: [
      "e2e:",
      "  timeout-minutes: 20",
      "  steps:",
      "    # …",
      "    - name: End-to-end tests",
      "      run: npm run test:e2e",
      "    - name: Upload Playwright report",
      "      if: failure()",
    ],
  },
  {
    id: "image",
    label: { en: "Image", "pt-br": "Imagem" },
    icon: "container",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose: {
      en: "Build the production container, smoke-test it, and scan it for vulnerabilities.",
      "pt-br":
        "Gera o container de produção, faz um smoke test e procura vulnerabilidades nele.",
    },
    explanation: {
      en: "The image is started and probed before anything else trusts it. Trivy fails the job on fixable critical or high vulnerabilities. On main, the exact tested image is kept as an artifact for publishing.",
      "pt-br":
        "A imagem é iniciada e verificada antes que qualquer outra etapa confie nela. O Trivy reprova o job se houver vulnerabilidades críticas ou altas com correção disponível. Na main, a imagem exata que foi testada é guardada como artefato para a publicação.",
    },
    steps: [
      { name: "actions/checkout" },
      { name: "./.github/actions/setup" },
      { name: "docker/setup-buildx-action" },
      { name: "Image tags and labels" },
      { name: "Build image" },
      { name: "Smoke-test the container" },
      { name: "Export image" },
      { name: "Scan image (SARIF report)" },
      { name: "Upload scan to code scanning" },
      { name: "Fail on fixable CRITICAL/HIGH vulnerabilities" },
      { name: "Keep the tested image for publishing", events: ["push-main"] },
    ],
    excerpt: [
      "image:",
      "  permissions:",
      "    contents: read",
      "    security-events: write",
      "  steps:",
      "    # …",
      "    - name: Smoke-test the container",
      '      run: scripts/smoke-container.sh "$IMAGE_REF"',
      "    # …",
      "    - name: Fail on fixable CRITICAL/HIGH vulnerabilities",
      "      run: >-",
      '        docker run --rm -v "$PWD:/work" -v "$HOME/.cache/trivy:/root/.cache/trivy" "$TRIVY"',
      "        image --input /work/image.tar --scanners vuln --severity CRITICAL,HIGH --ignore-unfixed",
      "        --skip-db-update --exit-code 1",
      "    - name: Keep the tested image for publishing",
      "      if: env.IS_MAIN_PUSH == 'true'",
    ],
  },
  {
    id: "publish",
    label: { en: "Publish", "pt-br": "Publicação" },
    icon: "package",
    needs: ["quality", "e2e", "image"],
    events: ["push-main"],
    purpose: {
      en: "Push the tested image to GHCR, tagged with the commit SHA and main.",
      "pt-br":
        "Envia ao GHCR a imagem testada, com as tags do SHA do commit e main.",
    },
    explanation: {
      en: "Publishing waits for every check and pushes the same image that was tested, instead of rebuilding it. Only this job can write packages.",
      "pt-br":
        "A publicação espera todas as verificações e envia a mesma imagem que foi testada, em vez de gerá-la de novo. Só este job pode escrever pacotes.",
    },
    steps: [
      { name: "actions/download-artifact" },
      { name: "docker load -i image.tar" },
      { name: "docker/login-action" },
      { name: "Push the tested image" },
    ],
    excerpt: [
      "publish:",
      "  if: github.event_name == 'push' && github.ref == 'refs/heads/main'",
      "  needs: [quality, e2e, image]",
      "  permissions:",
      "    contents: read",
      "    packages: write",
      "  steps:",
      "    # …",
      "    - name: Push the tested image",
    ],
  },
  {
    id: "deploy-preview",
    label: { en: "Preview deploy", "pt-br": "Deploy de preview" },
    icon: "preview",
    needs: ["quality"],
    events: ["pull-request"],
    purpose: {
      en: "Deploy the pull request to a Vercel preview URL.",
      "pt-br": "Faz o deploy do pull request em uma URL de preview na Vercel.",
    },
    explanation: {
      en: "Previews only wait for the quality job, so reviewers get a link early. They never touch production or the image registry.",
      "pt-br":
        "Os previews só esperam o job de qualidade, para que quem revisa receba um link cedo. Eles nunca tocam a produção nem o registro de imagens.",
    },
    steps: [
      { name: "actions/checkout" },
      { name: "./.github/actions/setup" },
      { name: "./.github/actions/vercel-deploy" },
    ],
    excerpt: [
      "deploy-preview:",
      "  if: github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository",
      "  needs: [quality]",
      "  environment:",
      "    name: preview",
    ],
  },
  {
    id: "deploy-production",
    label: { en: "Production deploy", "pt-br": "Deploy em produção" },
    icon: "deploy",
    needs: ["publish"],
    events: ["push-main"],
    purpose: {
      en: "Deploy main to production on Vercel, after the image is published.",
      "pt-br":
        "Faz o deploy da main em produção na Vercel, depois que a imagem é publicada.",
    },
    explanation: {
      en: "Production deploys queue instead of cancelling each other, and the run summary records the image tag of the same commit for traceability.",
      "pt-br":
        "Os deploys em produção entram em fila em vez de se cancelarem, e o resumo da execução registra a tag da imagem do mesmo commit, para rastreabilidade.",
    },
    steps: [
      { name: "actions/checkout" },
      { name: "./.github/actions/setup" },
      { name: "./.github/actions/vercel-deploy" },
      { name: "Image of the same commit" },
    ],
    excerpt: [
      "deploy-production:",
      "  if: github.event_name == 'push' && github.ref == 'refs/heads/main'",
      "  needs: [publish]",
      "  concurrency:",
      "    group: deploy-production",
      "    cancel-in-progress: false",
      "  environment:",
      "    name: production",
    ],
  },
];

export const pipelineScenarios: readonly ScenarioEntry[] = [
  {
    id: "push-main",
    label: { en: "Push to main", "pt-br": "Push na main" },
    summary: {
      en: "A commit lands on main. Every check passes, the tested image is published and production is deployed.",
      "pt-br":
        "Um commit chega à main. Todas as verificações passam, a imagem testada é publicada e a produção recebe o deploy.",
    },
    event: "push-main",
  },
  {
    id: "pull-request",
    label: { en: "Pull request", "pt-br": "Pull request" },
    summary: {
      en: "A pull request from the same repository. Checks run and a preview is deployed; nothing is published.",
      "pt-br":
        "Um pull request do próprio repositório. As verificações rodam e um preview é publicado; nada vai para o registro.",
    },
    event: "pull-request",
  },
  {
    id: "failure-main",
    label: { en: "Failure on main", "pt-br": "Falha na main" },
    summary: {
      en: "An end-to-end test fails on main. Publishing and the production deploy never start.",
      "pt-br":
        "Um teste end-to-end falha na main. A publicação e o deploy em produção nem começam.",
    },
    event: "push-main",
    failure: {
      job: "e2e",
      step: "End-to-end tests",
      reason: {
        en: "An end-to-end test fails.",
        "pt-br": "Um teste end-to-end falha.",
      },
    },
  },
  {
    id: "vulnerable-image",
    label: { en: "Vulnerable image", "pt-br": "Imagem vulnerável" },
    summary: {
      en: "Trivy finds a fixable critical vulnerability in the image on main. Nothing is published.",
      "pt-br":
        "O Trivy encontra uma vulnerabilidade crítica com correção disponível na imagem da main. Nada é publicado.",
    },
    event: "push-main",
    failure: {
      job: "image",
      step: "Fail on fixable CRITICAL/HIGH vulnerabilities",
      reason: {
        en: "Trivy finds a fixable CRITICAL vulnerability.",
        "pt-br":
          "O Trivy encontra uma vulnerabilidade nível CRITICAL com correção disponível.",
      },
    },
  },
];

/** The modeled workflow with its texts in `locale`. */
export function getLabPipeline(locale: Locale) {
  return localize(
    {
      intro: pipelineIntro,
      scope: pipelineScope,
      trigger: pipelineTrigger,
      jobs: ciJobs,
      scenarios: pipelineScenarios,
    },
    locale,
  );
}
