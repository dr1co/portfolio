export type StageIcon = "commit" | "build" | "test" | "package" | "deploy";

export type PipelineStage = {
  id: "push" | "build" | "test" | "publish" | "deploy";
  label: string;
  icon: StageIcon;
  purpose: string;
  explanation: string;
  command: readonly string[];
  workflowFile: string;
  workflow: readonly string[];
};

// TODO(content): review stage wording. All commands and workflow excerpts are illustrative.
export const pipelineStages: readonly PipelineStage[] = [
  {
    id: "push",
    label: "Git Push",
    icon: "commit",
    purpose: "A commit to main, or a pull request, triggers the workflow.",
    explanation:
      "Every change enters the pipeline the same way. The trigger is declared in the workflow file, so nothing depends on someone remembering to run a script.",
    command: ["$ git push origin main"],
    workflowFile: ".github/workflows/ci.yml",
    workflow: ["on:", "  push:", "    branches: [main]", "  pull_request:"],
  },
  {
    id: "build",
    label: "Build",
    icon: "build",
    purpose:
      "Build a reproducible image from a pinned base with a multi-stage Dockerfile.",
    explanation:
      "The image is the unit that moves through the rest of the pipeline. Pinned base images and a lockfile keep two builds of the same commit equivalent.",
    command: ["$ docker build -t app:$GIT_SHA ."],
    workflowFile: ".github/workflows/ci.yml",
    workflow: [
      "- uses: docker/setup-buildx-action@<pinned-sha>",
      "- run: docker build -t app:${{ github.sha }} .",
    ],
  },
  {
    id: "test",
    label: "Test",
    icon: "test",
    purpose:
      "Run lint and tests inside the built image, so CI tests what ships.",
    explanation:
      "Testing the image instead of the runner's environment catches missing dependencies and configuration drift before anything is published.",
    command: ["$ docker run --rm app:$GIT_SHA pytest -q"],
    workflowFile: ".github/workflows/ci.yml",
    workflow: ["- run: docker run --rm app:${{ github.sha }} pytest -q"],
  },
  {
    id: "publish",
    label: "Publish Image",
    icon: "package",
    purpose:
      "Push an immutable, SHA-tagged image to GHCR with least-privilege permissions.",
    explanation:
      "Tagging by commit SHA makes every deployment traceable to its source. The job only gets the permissions it needs to write packages.",
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
    label: "Deploy",
    icon: "deploy",
    purpose:
      "Pull the exact tagged image on the target and restart, keeping the previous tag for rollback.",
    explanation:
      "Deploying a known tag rather than latest means a rollback is just redeploying the previous SHA. A health check should confirm the result; this demo does not run one.",
    command: ["$ docker compose pull", "$ docker compose up -d"],
    workflowFile: ".github/workflows/release.yml",
    workflow: [
      "environment: production",
      '- run: ssh deploy@<host> "IMAGE_TAG=${{ github.sha }} docker compose up -d"',
    ],
  },
];
