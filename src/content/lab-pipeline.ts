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

export type CiJob = {
  id: CiJobId;
  label: string;
  icon: LabIcon;
  needs: readonly CiJobId[];
  events: readonly PipelineEvent[];
  purpose: string;
  explanation: string;
  steps: readonly CiStep[];
  /** Lines quoted verbatim from ci.yml; `# …` marks omitted lines. */
  excerpt: readonly string[];
};

export type PipelineTrigger = {
  label: string;
  icon: LabIcon;
  purpose: string;
  explanation: string;
  excerpt: readonly string[];
};

export type Scenario = {
  id: "push-main" | "pull-request" | "failure-main" | "vulnerable-image";
  label: string;
  summary: string;
  event: PipelineEvent;
  failure?: { job: CiJobId; step: string; reason: string };
};

export const workflowPath = ".github/workflows/ci.yml";
export const workflowUrl = `${siteConfig.sourceRepoUrl}/blob/main/${workflowPath}`;
export const workflowRunsUrl = `${siteConfig.sourceRepoUrl}/actions/workflows/ci.yml`;

/** How each event reads in a sentence, e.g. "Runs only on pull requests." */
export const eventLabels: Record<PipelineEvent, string> = {
  "push-main": "pushes to main",
  "pull-request": "pull requests",
};

/** A single occurrence of each event, e.g. "Event: push to main". */
export const eventNames: Record<PipelineEvent, string> = {
  "push-main": "push to main",
  "pull-request": "pull request",
};

// TODO(content): review the page intro and scope note.
export const pipelineIntro =
  "This is the CI/CD workflow that builds, tests and deploys this site, modeled job by job. Outcomes are scripted from the real workflow. Nothing here triggers GitHub Actions.";

export const pipelineScope =
  "A simplified model: runs that get cancelled, pull requests from forks and real durations aren't shown.";

// TODO(content): review all Lab pipeline copy. Structure and excerpts are checked against ci.yml by lab-pipeline.drift.test.ts.
export const pipelineTrigger: PipelineTrigger = {
  label: "Trigger",
  icon: "trigger",
  purpose: "A push to main or a pull request starts the workflow.",
  explanation:
    "Both events run the same file. Conditions on each job decide what happens next: pull requests get a preview, only main gets published and deployed to production.",
  excerpt: ["on:", "  pull_request:", "  push:", "    branches: [main]"],
};

export const ciJobs: readonly CiJob[] = [
  {
    id: "quality",
    label: "Quality",
    icon: "checks",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose:
      "Lint, typecheck, format check and unit tests, plus linters for the workflows and the Dockerfile.",
    explanation:
      "The fastest feedback runs first and in parallel with the slower jobs. The CI configuration itself is linted, so a broken workflow fails here instead of at deploy time.",
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
    label: "E2E tests",
    icon: "browser",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose:
      "Build the site and run the Playwright suite in a real browser, including accessibility checks.",
    explanation:
      "When a test fails, the Playwright report is uploaded as an artifact, so the failure can be inspected without rerunning it locally.",
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
    label: "Image",
    icon: "container",
    needs: [],
    events: ["push-main", "pull-request"],
    purpose:
      "Build the production container, smoke-test it, and scan it for vulnerabilities.",
    explanation:
      "The image is started and probed before anything else trusts it. Trivy fails the job on fixable critical or high vulnerabilities. On main, the exact tested image is kept as an artifact for publishing.",
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
    label: "Publish",
    icon: "package",
    needs: ["quality", "e2e", "image"],
    events: ["push-main"],
    purpose:
      "Push the tested image to GHCR, tagged with the commit SHA and main.",
    explanation:
      "Publishing waits for every check and pushes the same image that was tested, instead of rebuilding it. Only this job can write packages.",
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
    label: "Preview deploy",
    icon: "preview",
    needs: ["quality"],
    events: ["pull-request"],
    purpose: "Deploy the pull request to a Vercel preview URL.",
    explanation:
      "Previews only wait for the quality job, so reviewers get a link early. They never touch production or the image registry.",
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
    label: "Production deploy",
    icon: "deploy",
    needs: ["publish"],
    events: ["push-main"],
    purpose:
      "Deploy main to production on Vercel, after the image is published.",
    explanation:
      "Production deploys queue instead of cancelling each other, and the run summary records the image tag of the same commit for traceability.",
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

export const pipelineScenarios: readonly Scenario[] = [
  {
    id: "push-main",
    label: "Push to main",
    summary:
      "A commit lands on main. Every check passes, the tested image is published and production is deployed.",
    event: "push-main",
  },
  {
    id: "pull-request",
    label: "Pull request",
    summary:
      "A pull request from the same repository. Checks run and a preview is deployed; nothing is published.",
    event: "pull-request",
  },
  {
    id: "failure-main",
    label: "Failure on main",
    summary:
      "An end-to-end test fails on main. Publishing and the production deploy never start.",
    event: "push-main",
    failure: {
      job: "e2e",
      step: "End-to-end tests",
      reason: "An end-to-end test fails.",
    },
  },
  {
    id: "vulnerable-image",
    label: "Vulnerable image",
    summary:
      "Trivy finds a fixable critical vulnerability in the image on main. Nothing is published.",
    event: "push-main",
    failure: {
      job: "image",
      step: "Fail on fixable CRITICAL/HIGH vulnerabilities",
      reason: "Trivy finds a fixable CRITICAL vulnerability.",
    },
  },
];
