# Delivery — Implementation Plan

**Feature:** CI/CD for the portfolio itself: quality workflow, production container image on GHCR, Vercel deployments with post-deploy verification, and operational docs.
**Source specs:** [features-specification.md §11, §12, §13 Phase 4](features-specification.md)
**Branch:** `ops/delivery`, cut from `main` (projects work merged in PR #1, Step 0 in PR #2). The owner makes all commits **and pushes**. Several acceptance criteria need a real GitHub Actions run, so those steps end with "owner pushes, then we read the run".
**Status:** In progress (Steps 0–4 and 8 done; Step 3 verified in CI; Step 5 passing build and smoke, Trivy fix pending re-run; Step 6 waiting on the owner). Decisions settled with the owner on 2026-10-22. Working rules (TDD, owner commits, KISS, docs in sync) are in [AGENTS.md](../AGENTS.md).

---

## 0. Gate (check before Step 1)

- [x] The base branch (`ops/delivery`, containing the projects work) is green locally (`npm run check`, `npm run build`, `npm run test:e2e`).
- [x] `https://github.com/dr1co/portfolio` exists and the owner can push branches and open PRs.
- [x] Docker works inside WSL (`docker version`; 29.5.3 is currently installed).

Steps 6 and 7 have their own gate: the owner's Vercel and GitHub setup (§6).

---

## 1. Decisions

| #   | Topic                    | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | Hosting                  | **Vercel** serves the site. The Docker image is a **verified, published artifact** (spec §12.2): it's built, smoke-tested, scanned and pushed, but it doesn't serve production.                                                                                                                                                                                                                                                                                                                  |
| D2  | Deploy trigger           | **GitHub Actions drives Vercel.** Vercel's Git auto-deploy is disabled (`vercel.json`: `git.deploymentEnabled: false`). CI runs `vercel pull` → `vercel build` → `vercel deploy --prebuilt` only after the checks pass. Every deployment is traceable to a commit SHA.                                                                                                                                                                                                                           |
| D3  | Previews                 | Every **same-repo PR** gets a Vercel preview deployment. Fork PRs get checks only, because they have no secrets. Previews stay `noindex` because `NEXT_PUBLIC_ALLOW_INDEXING` is `true` only in Vercel's Production environment. The preview URL is shown through the GitHub environment (`preview`) and the job summary, so the job needs no `pull-requests: write`.                                                                                                                            |
| D4  | Image publishing         | Publish to `ghcr.io/dr1co/portfolio` on **every push to `main`**. Tags are `sha-<7>` (immutable, the release identifier) and `main` (moving convenience). There is no `latest`. PRs build and scan the image but never push it.                                                                                                                                                                                                                                                                  |
| D5  | Build-time configuration | `NEXT_PUBLIC_*` values are inlined at build (self-hosting guide). **Vercel:** set them per environment in Vercel project settings, and `vercel pull` brings them into the build. **Image:** pass them as Docker build args from GitHub repository variables. The image is always built **without** `NEXT_PUBLIC_ALLOW_INDEXING`, because it isn't the canonical deployment. The domain is not chosen yet, so until it is, `NEXT_PUBLIC_SITE_URL` stays unset and the localhost fallback applies. |
| D6  | Version in footer        | The footer shows `Version <sha7>`, linked to the commit on GitHub, read from a server-only `COMMIT_SHA` that CI sets for both Vercel and Docker builds. It's hidden when the value is unset (local dev). It's a build fact, not a "live" claim (spec §12.3).                                                                                                                                                                                                                                     |
| D7  | E2E in CI                | The **full Playwright suite** (both projects, axe) runs on every PR and every `main` push. One **smoke spec** (`@smoke`) runs against the container, every preview and production after deploy. It also asserts that the footer shows the expected SHA, which proves the deployment serves this commit.                                                                                                                                                                                          |
| D8  | Health                   | Health means `GET /` returns `200`. No `/api/health` route (KISS). The container `HEALTHCHECK` uses Node's `fetch`, because the image has no curl. Vercel deploys are verified by the smoke spec, not by a status indicator.                                                                                                                                                                                                                                                                     |
| D9  | Rollback                 | **Manual and documented.** A failed production smoke test fails the workflow and notifies the owner. The runbook covers `vercel rollback` (or `vercel promote <previous-deployment>`) and re-running an older workflow run. No auto-rollback.                                                                                                                                                                                                                                                    |
| D10 | Supply chain             | **Dependabot** (npm, github-actions, docker; weekly; `next`, `@next/mdx` and `eslint-config-next` updated together) and a **Trivy** image scan that fails on fixable CRITICAL/HIGH and uploads SARIF to the Security tab. No SBOM, provenance or signing in this plan.                                                                                                                                                                                                                           |
| D11 | Action pinning           | Third-party actions are pinned to a **full commit SHA** with a `# vX.Y.Z` comment. Dependabot keeps them current (spec §11).                                                                                                                                                                                                                                                                                                                                                                     |
| D12 | Permissions              | Top-level `permissions: contents: read`. Jobs widen only what they need: the image job gets `packages: write` (main only) and `security-events: write`. Deploy jobs need nothing beyond `contents: read`, because Vercel auth uses a secret. GHCR uses `GITHUB_TOKEN`, never a PAT.                                                                                                                                                                                                              |
| D13 | Workflow shape           | One workflow, `.github/workflows/ci.yml`, with conditional jobs. The pipeline preview on the home page already names this file. `concurrency` cancels superseded PR runs, and production deploys are serialized and **never** cancelled.                                                                                                                                                                                                                                                         |
| D14 | Self-proof               | A CI status badge in `README.md` and the footer version (D6). The home pipeline preview stays as-is and labeled illustrative.                                                                                                                                                                                                                                                                                                                                                                    |
| D15 | Infra linting            | `actionlint` (workflows) and `hadolint` (Dockerfile) run in the quality job. They're cheap, and they catch errors that otherwise only show up after a push.                                                                                                                                                                                                                                                                                                                                      |
| D16 | Node version             | `.nvmrc` = `24` is the single source: `setup-node` reads it (`node-version-file`), the Dockerfile uses `node:24-alpine` pinned by digest, and the Vercel project's Node setting is set to 24.x by the owner.                                                                                                                                                                                                                                                                                     |

---

## 2. Constraints (verified against the code and `node_modules/next/dist/docs/`)

1. **No static export.** `src/proxy.ts` (unknown-slug 404s) and Cache Components need the Node server. On Vercel the proxy runs as routing middleware, and the smoke spec's 404 check confirms it there.
2. **`output: "standalone"`** (`api-reference/config/next-config-js/output.md`) produces `.next/standalone/server.js`. `public/` and `.next/static` must be copied in manually. Enable it **only for the Docker build** (`BUILD_STANDALONE=1` → `output: "standalone"`), so `next start` (Playwright's web server) and `vercel build` are unaffected.
3. **File tracing and the case-study page.** `src/app/projects/[slug]/page.tsx` calls `readFileSync(process.cwd() + "/src/content/case-studies/…")`. Those pages are prerendered, but if anything re-renders at runtime the file must exist in the standalone output. Add `outputFileTracingIncludes: { "/projects/*": ["src/content/case-studies/**/*.mdx"] }`. The container smoke test covers a case study, so a regression fails CI.
4. **The build needs network** (Google Fonts via `next/font/google`, see projects-plan D4). GitHub runners and `docker build` have network, so nothing changes, but offline local Docker builds fail.
5. **`NEXT_PUBLIC_*` is inlined at build** (`guides/self-hosting.md`). One image can't switch domains at runtime, which is accepted (D5).
6. **Cache Components** work with `next start` and Docker (`guides/self-hosting.md`). No custom cache handler is needed for a single container.
7. Playwright's `webServer` must be **skipped** when it targets a remote URL. `reuseExistingServer` is already off in CI.

---

## 3. Target file tree (additions and changes)

```text
.github/
  workflows/ci.yml                 NEW  quality, e2e, image, deploy-preview, deploy-production
  dependabot.yml                   NEW  npm, github-actions, docker
Dockerfile                         NEW  multi-stage: deps → build (standalone) → runtime (non-root, HEALTHCHECK)
.dockerignore                      NEW
.nvmrc                             NEW  24
vercel.json                        NEW  git.deploymentEnabled: false
scripts/smoke-container.sh         NEW  build → run → wait healthy → smoke spec → clean up (local + CI)
next.config.ts                     CHG  conditional standalone output, tracing include
playwright.config.ts               CHG  BASE_URL mode (no webServer), optional bypass header, html report in CI
package.json                       CHG  vercel CLI devDependency; scripts test:smoke, docker:smoke
.env.example                       CHG  COMMIT_SHA
src/lib/build-info.ts              NEW  commit SHA → { short, url } | null
src/components/layout/site-footer.tsx  CHG  "Version abc1234" link
e2e/smoke.spec.ts                  CHG  @smoke checks, expected SHA
docs/operations.md                 NEW  runbook: deploy, verify, rollback, rotate secrets, run image
README.md, AGENTS.md, docs/prepublish-checklist.md   CHG
```

---

## 4. Test seams (proposed, confirm with the owner before Step 1)

| Seam       | Level        | Behaviours                                                                                                                                                                                                                        |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build info | unit         | `getBuildInfo(env)` returns `null` for missing or invalid values (not 7–40 hex chars), and otherwise `{ short, url }` with a 7-char short SHA and a commit URL under `sourceRepoUrl`. The URL goes through `links.ts` validation. |
| Footer     | unit         | `BuildVersion` shows "Version abc1234", linked when a URL exists (`SiteFooter` itself is async and not jsdom-renderable).                                                                                                         |
| Smoke      | e2e (remote) | `/` 200 with `lang="en"` and one h1; `/projects` 200; a known case study 200; an unknown slug 404 (proxy); `robots` meta matches the expected indexing flag; when `EXPECTED_SHA` is set, the footer shows it.                     |
| Container  | script       | `scripts/smoke-container.sh` exits non-zero if the image doesn't build, the container doesn't become `healthy`, it runs as root, or the smoke spec fails.                                                                         |
| Workflow   | lint + run   | `actionlint` passes; a real PR run shows the expected jobs and skips; a `main` run publishes `sha-*` and `main` tags and deploys. Workflows can't be unit-tested, so the real runs are the acceptance test.                       |

---

## 5. Implementation steps

Work test-first where code is involved, per AGENTS.md. Each step must pass `npm run check`. Steps touching rendering or config must also pass `npm run build` and `npm run test:e2e`.

### Step 0 — Baseline

1. Verify §0 on `ops/delivery`.
2. Add `.nvmrc` (`24`). Run `npm run check && npm run build && npm run test:e2e`.

Suggested commit: `[chore] pin Node version for delivery work`

### Step 1 — Build info and footer version

1. **Unit first** (`src/lib/build-info.test.ts`): the cases in §4.
2. `src/lib/build-info.ts`: `getBuildInfo(sha = process.env.COMMIT_SHA, repoUrl = siteConfig.sourceRepoUrl)`. It's server-only and read at prerender, which is safe under Cache Components because it doesn't involve `Date` or randomness.
3. **Unit first** (`build-version.test.tsx`): version linked or plain text. `SiteFooter` renders the async `CopyrightYear`, so the testable seam is the small `BuildVersion` component it composes.
4. Footer: append ` · Version <short>` (an `AppLink`, external) to the "Built with" line.
5. `.env.example`: document `COMMIT_SHA` ("set by CI; leave empty locally").

Suggested commit: `[feat.] show build commit in footer`

### Step 2 — Smoke spec and remote mode

1. Extend `e2e/smoke.spec.ts` with the §4 smoke checks and tag them `@smoke`. Read the case-study slug from `getCaseStudySlugs()` rather than hard-coding it. The indexing expectation comes from `EXPECT_INDEXABLE=true` (default: `noindex`). Step 7 sets it on the production smoke run once indexing is enabled there.
2. `playwright.config.ts`:
   - If `BASE_URL` is set, use it as `baseURL` and omit `webServer`.
   - If `VERCEL_AUTOMATION_BYPASS_SECRET` is set, send `x-vercel-protection-bypass` via `extraHTTPHeaders` (Vercel Deployment Protection).
   - In CI the reporter becomes `[["github"], ["html", { open: "never" }]]`, so the report can be uploaded.
3. `package.json`: `"test:smoke": "playwright test --grep @smoke --project=desktop-chromium"`.
4. The smoke spec still runs in the full local suite, so it is itself tested on every `test:e2e`.

**Acceptance:** `npm run test:e2e` is green, and `BASE_URL=http://localhost:3100 npm run test:smoke` passes against a running local build.
Suggested commit: `[test] smoke spec runnable against any deployment`

### Step 3 — Production container

1. `next.config.ts`: `output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined` plus `outputFileTracingIncludes` (§2.3).
2. `Dockerfile`, multi-stage, with `node:24-alpine@sha256:…` in every stage:
   - `deps`: `npm ci` with a cache mount.
   - `build`: `ARG NEXT_PUBLIC_SITE_URL`, `ARG COMMIT_SHA`, `ENV BUILD_STANDALONE=1 NEXT_TELEMETRY_DISABLED=1`, then `npm run build`.
   - `runtime`: copy `.next/standalone` and `.next/static` only (`public/` once it exists). Run as `USER node`, `ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0`, `EXPOSE 3000`, `HEALTHCHECK CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"`, `CMD ["node","server.js"]`.
   - OCI labels: `org.opencontainers.image.source=https://github.com/dr1co/portfolio` (links the GHCR package to the repo) and `revision=$COMMIT_SHA`.
   - No secrets, no `.env*` files in any layer.
3. `.dockerignore` as an **allowlist** (amended: safer than a denylist): `package.json`, `package-lock.json`, `next.config.ts`, `next-env.d.ts`, `tsconfig.json`, `src/` minus tests, `public/`.
4. `scripts/smoke-container.sh` (bash, `set -euo pipefail`): build with a tag, run on port **3200** detached, wait up to 60 s for `healthy`, assert `docker exec … id -u` ≠ 0, run `BASE_URL=http://localhost:3200 EXPECTED_SHA=… npm run test:smoke`, then always `docker rm -f` through a `trap`. `npm run docker:smoke` wraps it.
5. Record the image size in the README. Target < 200 MB. It's not a hard gate.

**Acceptance:** `npm run docker:smoke` passes, and hadolint is clean. The standalone server was verified with Node directly (all `@smoke` checks pass, MDX traced, 54 MB). The proxy on the owner's current network blocks image pulls, so the Docker run happens on another network or in CI (Step 5). **Verified in CI (Step 5 PR):** the build, health check, non-root check and `@smoke` all passed. The first Trivy gate then failed on HIGH CVEs in the base image's bundled npm tooling (`brace-expansion` 5.0.9, `undici` 6.28.0), not in the app's dependencies. Fixed by deleting npm, npx, corepack and yarn from the runtime stage.
Suggested commit: `[build] production Docker image with health check and smoke script`

### Step 4 — Quality workflow (PR)

`.github/workflows/ci.yml`, triggered on `pull_request` and `push: branches: [main]`:

| Job       | Runs on  | Does                                                                                                                                                                                                                                             |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `quality` | PR, main | checkout → `setup-node` (`.nvmrc`, npm cache) → `npm ci` → `npm run lint`, `typecheck`, `format:check`, `test` as **separate steps** (readable failures) → `actionlint` → `hadolint`.                                                            |
| `e2e`     | PR, main | `npm ci` → cached Playwright Chromium (`~/.cache/ms-playwright`, keyed by the `@playwright/test` version) → `npx playwright install --with-deps chromium` → `npm run test:e2e` (builds via `webServer`) → upload `playwright-report` on failure. |

- Top-level `permissions: contents: read` and `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: ${{ github.event_name == 'pull_request' }} }`.
- Pin actions by SHA (D11). Set `timeout-minutes` on every job.
- `typecheck` needs `.next/types` (AGENTS.md gotcha): run `npx next typegen` before `tsc` in the quality job.

**Acceptance:** actionlint (with shellcheck) and hadolint pass locally from their release binaries, since the proxy blocks the images. The owner pushes the branch and opens a PR, and both jobs are green on the real run. Amended: the linters run as digest-pinned images rather than third-party actions, and the home-page axe tests are marked `test.slow()` (about 11 s each, which went past 30 s under parallel load).
**Owner, after the first green run:** protect `main` with required checks `quality` and `e2e`.
Suggested commit: `[ci] quality and e2e workflow`

### Step 5 — Image jobs (build, scan, publish)

Amended during implementation: publishing moved to its own job, so `packages: write` never reaches PR runs. Trivy runs as a digest-pinned image instead of `aquasecurity/trivy-action`, in line with the linters.

1. Job `image` (all events, runs in parallel with the others; `security-events: write`):
   - Tags from `docker/metadata-action`: `sha-<7>` always, plus `main` on `main` pushes.
   - Build with `load: true` and the GHA cache. Build args are `COMMIT_SHA=${{ github.sha }}` and `NEXT_PUBLIC_SITE_URL=${{ vars.SITE_URL }}`.
   - Run `scripts/smoke-container.sh <tag>` against the built image.
   - `docker save` the image, then run Trivy twice on the tarball: once for a SARIF report that goes to code scanning (non-blocking, skipped for fork PRs), and once as the gate (`--severity CRITICAL,HIGH --ignore-unfixed --exit-code 1`).
   - On `main` pushes, upload the tarball as a 1-day artifact.
2. Job `publish` (`main` pushes only; needs `quality`, `e2e`, `image`; `packages: write`): download the tested tarball, `docker load` it, log in to GHCR with `GITHUB_TOKEN`, push every tag, and write the tags, digest and commit to the job summary. What gets published is byte-for-byte the image that was smoke-tested and scanned.
3. Node, npm and Playwright setup moved into the local composite action `.github/actions/setup` (input `playwright`), which `quality`, `e2e` and `image` share.

**Acceptance:** a PR run builds, smoke-tests and scans without pushing. This is also the first real Docker build (Step 3 verification). After the owner merges, the `main` run publishes `ghcr.io/dr1co/portfolio:sha-<7>` and `:main`.
**Owner:** set the GHCR package visibility to **public** (spec §11 asks for visibility to be documented) and confirm it's linked to the repo. If the repo is private without GitHub Advanced Security, the SARIF upload fails without failing the job. The Trivy gate still applies.
Suggested commit: `[ci] build, scan and publish container image`

### Step 6 — Owner setup for Vercel (gate for Step 7)

The owner does this by hand. Claude can generate a step-by-step wizard script (`mattpocock-skills:wizard`) if that helps, but never handles token values.

1. Create the Vercel project from `dr1co/portfolio` (framework: Next.js, Node 24.x). The `vercel.json` from Step 7 then turns off Git auto-deploys.
2. Vercel env vars:
   - **Production:** `NEXT_PUBLIC_SITE_URL` (the `*.vercel.app` URL until the domain exists) and `NEXT_PUBLIC_ALLOW_INDEXING=true` **only once the pre-publish checklist is done**.
   - **Preview:** neither.
3. Enable **Protection Bypass for Automation** and copy the secret.
4. Create a Vercel access token scoped to the team or project.
5. GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_AUTOMATION_BYPASS_SECRET`. Repository variable: `SITE_URL`.
6. GitHub environments: `preview` and `production`. Optionally add the owner as a required reviewer on `production`, which turns the deploy into a manual approval gate.

### Step 7 — Vercel deployments

1. `vercel.json`: `{ "git": { "deploymentEnabled": false } }`. Add `vercel` as a devDependency so the CLI version is locked and updated by Dependabot.
2. Job `deploy-preview` (PR from the same repo only: `github.event.pull_request.head.repo.full_name == github.repository`; needs `quality`):
   `vercel pull --yes --environment=preview` → `COMMIT_SHA=$GITHUB_SHA vercel build` → `vercel deploy --prebuilt` → capture the URL → `environment: { name: preview, url: <url> }` → run `test:smoke` against it with `EXPECTED_SHA` and the bypass header.
3. Job `deploy-production` (push to `main`; needs `quality`, `e2e`, `image`; `concurrency: { group: production, cancel-in-progress: false }`; `environment: production`):
   the same commands with `--environment=production`, `vercel build --prod` and `vercel deploy --prebuilt --prod`, then the smoke test against the deployment URL. The job summary lists the commit, the deployment URL and the GHCR image tag of the same SHA, so all three are traceable.
4. Pass secrets through `env:` only, never on the command line. They never show in logs.

**Acceptance:** a PR gets a working preview URL with a passing smoke test and `noindex`. After merge, production is deployed, its smoke test passes, and the footer shows the merged SHA.
Suggested commit: `[cd] gated Vercel preview and production deployments`

### Step 8 — Dependabot and badge

1. `.github/dependabot.yml`: `npm` (weekly; group `next`, `@next/mdx` and `eslint-config-next` as `next`; group the remaining minor/patch updates), `github-actions` (weekly) and `docker` (weekly, base-image digest).
2. README: CI badge for `ci.yml` on `main`.
3. Amended during implementation: the Dockerfile uses literal `FROM node:24-alpine@sha256:…` lines, because Dependabot can't bump `FROM ${ARG}`. npm updates have a 7-day cooldown, and Node majors are ignored, since they move with `.nvmrc`. The linter and Trivy images in `docker run` steps aren't visible to Dependabot and are bumped by hand.

Suggested commit: `[ci] Dependabot and CI badge`

### Step 9 — Docs and operations

1. `docs/operations.md` (runbook):
   - How a change ships (PR → checks → preview → merge → image + production).
   - Verifying a deploy (job summary, footer SHA, smoke).
   - **Rollback**: `vercel rollback` or `vercel promote <deployment-url>`, then fix forward with a revert PR. Note that the Hobby plan only rolls back to the previous production deployment, which needs to be verified.
   - Running a published image locally (`docker run -p 3000:3000 ghcr.io/dr1co/portfolio:sha-<7>`).
   - Rotating `VERCEL_TOKEN` and the bypass secret.
   - Re-running a failed deploy.
   - What to do when Trivy blocks a build.
2. README: status table, a "CI/CD and deployment" section (pipeline diagram in text, jobs, triggers, image tags, local Docker commands), and the "Known limitations" entry replaced with the remaining ones (no SBOM/signing, image not serving production, domain pending).
3. AGENTS.md: delivery gotchas found during implementation (standalone only via `BUILD_STANDALONE`, `BASE_URL` smoke mode, port 3200 for container smoke, actions pinned by SHA, don't edit `vercel.json` to re-enable Git deploys).
4. `docs/prepublish-checklist.md`: "Deployment configuration" now points to Vercel env vars, and the indexing flag is flipped there last.
5. README status for Phase 4 → done.

Suggested commit: `[docs] delivery pipeline and operations runbook`

---

## 6. Definition of done

- [ ] Every PR runs lint, typecheck, format, unit tests, actionlint, hadolint, full e2e (with axe), an image build, a container smoke test and a Trivy scan. Same-repo PRs get a smoke-tested preview.
- [ ] Every `main` push publishes `ghcr.io/dr1co/portfolio:sha-<7>` (and `:main`) and deploys production on Vercel only after all checks pass. The production smoke test verifies the SHA.
- [ ] The image runs as non-root, has a health check, contains no secrets and has documented build/run commands.
- [ ] Actions are SHA-pinned with least-privilege permissions. Dependabot covers npm, actions and docker.
- [ ] Rollback and secret rotation are documented in `docs/operations.md`.
- [ ] `npm run check`, `npm run build`, `npm run test:e2e` and `npm run docker:smoke` pass. README, AGENTS.md and the checklist are updated.

## 7. Not in this plan

- Custom domain and DNS (set `SITE_URL` / `NEXT_PUBLIC_SITE_URL` when chosen; no code change).
- Serving production from the container (any container host). The image is ready for it.
- SBOM, provenance attestations and image signing.
- Auto-rollback, uptime monitoring and any "live/healthy" indicator on the site (spec §12.3).
- Linking the home pipeline preview to the real workflow, or a case study about this pipeline.
- Release tags (`v*`) and changelogs.

## 8. Risks

| Risk                                                                      | Mitigation                                                                                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Standalone tracing misses the MDX files read with `readFileSync`          | `outputFileTracingIncludes` (§2.3), and the container smoke test requests a case study.                                               |
| Vercel Deployment Protection returns 401 to the smoke test                | Protection Bypass for Automation secret sent as a header (Step 2, Step 6).                                                            |
| `vercel build` in CI differs from a Vercel-side build (Node version, env) | `vercel pull` fetches project settings and env. Node 24 is set in both places (D16). The smoke test checks the result.                |
| Trivy blocks on a base-image CVE with no fix in our control               | `ignore-unfixed`. A documented `.trivyignore` entry with a reason and expiry date as a last resort. Dependabot bumps the base digest. |
| Google Fonts unreachable during a CI or Docker build                      | Re-run the job. Self-hosting fonts stays out of scope (projects-plan D4).                                                             |
| Playwright e2e is slow or flaky in CI                                     | Browser cache, `retries: 2` in CI (already set), trace on first retry, uploaded report.                                               |
| `next start` and standalone diverge                                       | Full e2e runs on `next start`, and the smoke test covers the standalone server, so both paths are exercised.                          |
