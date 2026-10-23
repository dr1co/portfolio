# Operations runbook

How this site is built, shipped, verified and rolled back. Pipeline details are in [README.md → Continuous integration](../README.md#continuous-integration), and the reasoning behind them is in [delivery-plan.md](delivery-plan.md).

## How a change ships

```text
PR ──► quality ─┬─► deploy-preview (Vercel preview + @smoke)
     ► e2e      │
     ► image ───┘   (build, container @smoke, Trivy; nothing pushed)

merge to main ──► quality, e2e, image ──► publish (GHCR sha-<7>, main) ──► deploy-production (Vercel + @smoke)
```

- `main` is protected by the `main` ruleset: PRs only, no force pushes or deletion, and `quality`, `e2e`, `image` and `deploy-preview` must pass.
- Only CI deploys. Vercel's Git auto-deploy is off (`vercel.json`).
- Every production deployment has a GHCR image of the same commit, and the footer shows that commit.

## Verifying a deployment

1. Open the workflow run. The `deploy-production` (or `deploy-preview`) summary lists the deployment URL and commit. For production it also lists the image tag.
2. The `@smoke` step in that job already checked the deployment:
   - `/`, `/projects` and a case study answer 200, and an unknown slug answers 404.
   - The footer shows the expected commit.
   - Robots matches `NEXT_PUBLIC_ALLOW_INDEXING` for that environment.
3. To re-check by hand:

   ```bash
   BASE_URL=https://<deployment-url> EXPECTED_SHA=<commit> \
     VERCEL_AUTOMATION_BYPASS_SECRET=<secret> npm run test:smoke
   ```

   Add `EXPECT_INDEXABLE=true` for production once indexing is enabled. The bypass secret is only needed for URLs behind Deployment Protection, which is any URL except the production domain.

## Rolling back production

A failed production smoke test fails the run, but the new deployment is already live, so roll back first and fix forward second.

1. Find the last good deployment: the Vercel dashboard (**Deployments**, filter Production), or the summary of the last green `deploy-production` run.
2. Roll back, either with **Instant Rollback** in the dashboard or with the CLI:

   ```bash
   export VERCEL_TOKEN=<token> VERCEL_ORG_ID=<org> VERCEL_PROJECT_ID=<project>
   npx vercel@63.1.0 rollback <last-good-deployment-url> --yes
   npx vercel@63.1.0 rollback status
   ```

3. Check the production domain: the footer version should show the old commit.
4. Fix forward: revert or fix on a branch, open a PR, merge. The pipeline deploys and verifies the new commit.
5. After a rollback, check in the dashboard that the next production deployment actually receives the production domain. If it doesn't, promote it with `npx vercel@63.1.0 promote <deployment-url> --yes`.

Your Vercel plan may limit how far back Instant Rollback can go. Check before relying on an older deployment.

## Re-running a deploy

- A flaky failure (network, Google Fonts during the build): **Re-run failed jobs** on the workflow run.
- The image artifact handed from `image` to `publish` is kept for 1 day. After that, re-run the whole workflow, not just `publish`.

## Running a published image

```bash
docker run --rm -p 3000:3000 ghcr.io/dr1co/portfolio:sha-<7>     # http://localhost:3000
npm run docker:smoke -- ghcr.io/dr1co/portfolio:sha-<7>            # health, non-root, @smoke
```

`sha-<7>` is immutable. `main` always points at the latest publish. The full commit is in the image label `org.opencontainers.image.revision`.

## Secrets and configuration

| Name                              | Where                                               | Used by                                               |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| `VERCEL_TOKEN`                    | GitHub Actions secrets **and** Dependabot secrets   | Vercel CLI in the deploy jobs                         |
| `VERCEL_ORG_ID`                   | same                                                | Vercel CLI                                            |
| `VERCEL_PROJECT_ID`               | same                                                | Vercel CLI                                            |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | same                                                | `@smoke` against protected deployments                |
| `SITE_URL` (variable)             | GitHub Actions variables                            | `NEXT_PUBLIC_SITE_URL` build arg of the Docker image  |
| `NEXT_PUBLIC_SITE_URL`            | Vercel env (Production)                             | Canonical URLs and absolute OG URLs                   |
| `NEXT_PUBLIC_ALLOW_INDEXING`      | Vercel env (Production only, `true` when launching) | Robots. The production `@smoke` reads the same value. |

### Rotating the Vercel token

1. Vercel → Account Settings → Tokens: create a new token with the same scope and an expiration.
2. `gh secret set VERCEL_TOKEN` and `gh secret set VERCEL_TOKEN --app dependabot`. Both prompt for the value without echoing it.
3. Re-run the latest deploy job to confirm the new token works, then delete the old token in Vercel.

### Rotating the bypass secret

Regenerate it in Vercel (Project → Settings → Deployment Protection → Protection Bypass for Automation), then update `VERCEL_AUTOMATION_BYPASS_SECRET` in both secret stores, as above.

### Enabling indexing (launch)

When [prepublish-checklist.md](prepublish-checklist.md) is done:

1. Set `NEXT_PUBLIC_ALLOW_INDEXING=true` in Vercel, for **Production only**.
2. Deploy: merge anything to `main`, or re-run the last `deploy-production`. The `NEXT_PUBLIC_*` values are inlined at build, so changing the variable alone does nothing.
3. The production smoke test now expects `index`, and previews still expect `noindex`.

### Custom domain

Add the domain in Vercel. Then set `NEXT_PUBLIC_SITE_URL` (Vercel Production) and the `SITE_URL` variable (GitHub) to `https://<domain>`, and redeploy.

## When the Trivy gate fails

1. Read the table in the `image` job log, or the code-scanning alert, which shows file paths.
2. Find where the package comes from:
   - `npm ls <package>` and `.next/standalone/node_modules`: the app. Update the dependency (or add an npm `overrides` entry) and push.
   - Anything else, such as OS packages or `/usr/local/...`: the base image. Wait for or merge Dependabot's `node:24-alpine` digest bump, or bump the digest by hand (`docker buildx imagetools inspect node:24-alpine`).
3. Only as a last resort, for a finding with no fix and no exposure: add a `.trivyignore` with the CVE ID, a reason comment and a review date, and pass `--ignorefile /work/.trivyignore` to both Trivy steps.

## Pinned tools Dependabot can't see

Bump these by hand, keeping the same tag-plus-digest or exact-version form:

| Tool                 | Where                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| actionlint, hadolint | `docker run` image refs in `.github/workflows/ci.yml` (`docker buildx imagetools inspect <image>:<tag>`) |
| Trivy                | `TRIVY` env in the `image` job                                                                           |
| Vercel CLI           | `cli` input default in `.github/actions/vercel-deploy/action.yml`. Pick a release at least 2 weeks old.  |
