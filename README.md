# adriano.dev — DevOps & Automation Portfolio

Personal portfolio for **Adriano Matoba Lipski**: a professional profile and a small technical lab that explains how code gets from a commit to production. The goal is a site that feels like a well-built developer tool. It favours evidence over claims and never presents simulated data as real.

- Product requirements: [docs/features-specification.md](docs/features-specification.md)
- Visual identity ("Terminal Modern"): [docs/visual-identity.md](docs/visual-identity.md)
- Feature plans: [docs/homepage-plan.md](docs/homepage-plan.md) (home page, done) and [docs/projects-plan.md](docs/projects-plan.md) (projects directory and case studies, done)
- Pre-publish checklist (content still to review): [docs/prepublish-checklist.md](docs/prepublish-checklist.md)
- Rules for contributors and AI agents: [AGENTS.md](AGENTS.md)

## Status

| Area                                                | State                                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Tooling (lint, format, typecheck, unit + e2e tests) | Done                                                                                             |
| Design tokens, theme                                | Done                                                                                             |
| Layout, metadata, 404, OG image, icon               | Done                                                                                             |
| Home page `/`                                       | Done (content still to review; see [docs/prepublish-checklist.md](docs/prepublish-checklist.md)) |
| `/projects` directory                               | Done                                                                                             |
| `/projects/[slug]` case studies                     | Done; thesis case study drafted from its repo, awaiting review                                   |
| `/lab`, `/about`                                    | Not started                                                                                      |

## Tech stack

| Concern              | Choice                                   | Notes                                                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework            | Next.js 16 (App Router)                  | `cacheComponents` and partial prefetching are enabled. See [Next.js 16 notes](#nextjs-16-notes).                                                                                                                                       |
| Language             | TypeScript (strict)                      | `@/*` is an alias for `src/*`.                                                                                                                                                                                                         |
| Styling              | Tailwind CSS v4                          | Compiled through `@tailwindcss/turbopack`. Colors only through semantic tokens.                                                                                                                                                        |
| Theme                | `next-themes`                            | Light/dark, follows the OS on first visit, choice persisted.                                                                                                                                                                           |
| Motion               | `motion`                                 | Only where it explains a state change; respects reduced motion.                                                                                                                                                                        |
| Icons                | `lucide-react`                           |                                                                                                                                                                                                                                        |
| Case studies         | MDX via `@next/mdx`                      | Pinned to the installed `next` version. `remark-gfm` adds tables; `rehype-slug` adds heading ids; `@shikijs/rehype` highlights code at build time (`github-light-default` / `github-dark`, chosen for WCAG AA contrast; no client JS). |
| Unit/component tests | Vitest + React Testing Library + jsdom   |                                                                                                                                                                                                                                        |
| E2E tests            | Playwright + `@axe-core/playwright`      | Runs against a production build on port 3100.                                                                                                                                                                                          |
| Formatting           | Prettier + `prettier-plugin-tailwindcss` |                                                                                                                                                                                                                                        |

## Getting started

Prerequisites: **Node.js ≥ 20.9** and npm. CI, Docker and Vercel all use Node 24, pinned in [.nvmrc](.nvmrc) (`nvm use` picks it up).

```bash
npm install
npm run dev            # http://localhost:3000
```

Browser-based end-to-end tests also need Chromium:

```bash
npx playwright install chromium
```

> Behind a TLS-intercepting proxy this download fails with `SELF_SIGNED_CERT_IN_CHAIN`. Point Node at your corporate CA first: `export NODE_EXTRA_CA_CERTS=/path/to/corp-ca.pem`.

## Scripts

| Script                            | What it does                                                              |
| --------------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                        |
| `npm run build` / `npm start`     | Production build and server                                               |
| `npm run lint`                    | ESLint (Next.js core-web-vitals + TypeScript rules)                       |
| `npm run typecheck`               | `tsc --noEmit` (run `npx next typegen` first if routes moved)             |
| `npm run format` / `format:check` | Prettier write / verify                                                   |
| `npm test` / `test:watch`         | Vitest unit and component tests                                           |
| `npm run test:e2e`                | Playwright; builds and starts the app automatically                       |
| `npm run test:smoke`              | Only the `@smoke` checks (desktop); pair with `BASE_URL` for a deployment |
| `npm run docker:smoke`            | Build the image, run it, wait for healthy, check non-root, run `@smoke`   |
| `npm run check`                   | lint + typecheck + format check + unit tests (run before every commit)    |

## Project structure

```text
src/
  app/                routes (/, /projects, /projects/[slug]), root layout, OG images, global styles and tokens
  components/         UI grouped by domain: layout, navigation, theme, home, projects, pipeline, terminal, mdx, ui
  content/            typed content: projects, technologies, skills, pipeline stages
    case-studies/     one MDX file per case study
  lib/                site config and small pure helpers (links, headings, OG layout, hooks)
  mdx-components.tsx  Markdown element → component mapping for case studies
  proxy.ts            sends unknown case-study slugs to a real 404
e2e/                  Playwright specs
docs/                 specs, feature plans and the pre-publish checklist
```

Content (text, links, projects, case studies) is kept separate from components, so updating the site usually means editing `src/content/` or `src/lib/site-config.ts` only.

## Design system

- **Tokens:** semantic CSS variables (`--background`, `--surface`, `--foreground`, `--muted`, `--accent`, ...) are defined once in [src/app/globals.css](src/app/globals.css). Light values sit on `:root` and dark values on `[data-theme="dark"]`. `@theme inline` exposes them as Tailwind utilities (`bg-surface`, `text-muted`, `border-border`, ...). Components never use raw hex values.
- **Contrast is tested:** [src/app/tokens.test.ts](src/app/tokens.test.ts) parses `globals.css` and checks every text token against every surface for WCAG AA (4.5:1) in both themes. If you change a color, run `npm test`.
- **Deviation from the visual-identity doc:** in the light theme the accent `#347A42` became `#327640`, and the secondary accent `#087E91` became `#077485`. Both are slightly darker so they pass 4.5:1 on the page background; the hue is unchanged.
- **Theme:** `next-themes` sets `data-theme` on `<html>` before paint (no flash), follows the OS on the first visit and persists a manual choice in `localStorage` (`theme` key). `dark:` utilities are mapped to `[data-theme="dark"]`.
- **Utilities:** `dot-grid` (decorative background) and `cursor-blink` (disabled under reduced motion).

## Configuration and content

[src/lib/site-config.ts](src/lib/site-config.ts) holds identity, hero copy, navigation routes and public links:

- `routes[].enabled` controls which pages appear in navigation. Turn a route on when its page ships.
- `links.github`, `links.linkedin` and `links.email` are rendered only when valid (`https:` URLs, a well-formed email). In `npm run dev`, a console warning lists the missing ones.
- Helpers in [src/lib/links.ts](src/lib/links.ts) (`getContactLinks`, `getEnabledRoutes`, `getMissingLinks`) and [src/lib/hero-ctas.ts](src/lib/hero-ctas.ts) (hero buttons fall back from projects → GitHub → pipeline) turn the config into UI-ready data.

Typed content lives in `src/content/`:

| File                                           | Holds                                                                                                         | Notes                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [projects.ts](src/content/projects.ts)         | `projects` list and the ordered `projectGroups` (DevOps & Delivery → Backend & Automation → Machine Learning) | Every project has one `group`; `categories` are tags. Planned projects are never published, and non-`https` links are stripped. Helpers: `getFeaturedProjects()` (home, max 4), `getProjectDirectory()` (groups in order, empty ones dropped, sorted featured → status → title), `getCaseStudySlugs()` and `getProject(slug)` (only projects with a case study). |
| [skills.ts](src/content/skills.ts)             | Skill groups                                                                                                  | Set `learning: true` on anything not yet used in a substantive project.                                                                                                                                                                                                                                                                                          |
| [technologies.ts](src/content/technologies.ts) | Canonical technology id → display name map                                                                    | Projects (`technologies`) and skills (`tech`) reference ids, so names are spelled the same everywhere. A typo fails `typecheck`. Add new technologies here first.                                                                                                                                                                                                |
| [pipeline.ts](src/content/pipeline.ts)         | The five illustrative pipeline stages (command + workflow excerpt)                                            | Icons are string keys, because the data is passed to a client component.                                                                                                                                                                                                                                                                                         |

Unreviewed content is marked `// TODO(content):`. List it with `grep -rn "TODO(content)" src`.

## Layout and shared components

- **Root layout** ([src/app/layout.tsx](src/app/layout.tsx)), in render order: skip link, sticky header, `<main id="main">`, footer. The theme and Motion (`reducedMotion="user"`) providers wrap everything.
- **Header:** wordmark, routes with `enabled: true`, a "Contact" shortcut (only when a contact link exists), a GitHub icon (only when configured), the theme toggle, and a mobile menu (only when there's more than one item to show). `NavLink` marks its own page with `aria-current="page"` and its section's child pages (e.g. Projects on a case study) with `aria-current="true"`, both shown by underline and strong text.
- **Footer:** the copyright year comes from a `'use cache'` component, because Cache Components forbids reading `new Date()` while rendering. Also stack attribution, an optional source link, the build version, and contact icons. The version ("Version abc1234", linked to the commit) comes from `COMMIT_SHA`, which CI sets at build time. [`getBuildInfo`](src/lib/build-info.ts) ignores missing or non-hex values, so local builds show no version.
- **Links:** always use `AppLink` ([src/components/ui/app-link.tsx](src/components/ui/app-link.tsx)). Internal targets go through `next/link`. External ones get `target="_blank"`, `rel="noopener noreferrer"`, an arrow icon and screen-reader text. `ButtonLink` adds the primary and secondary button styles on top.
- **Other building blocks** in `src/components/ui/`:
  - `Container`: page width and gutters.
  - `Section`: anchor id, eyebrow, `h2`, entrance animation.
  - `Badge`: text label with an optional decorative icon.
  - `Reveal`: fade-in on scroll. A `<noscript>` style keeps it visible without JavaScript.
  - `iconButtonClass`: shared style for 40×40 icon controls.
  - `contactIcons`: local GitHub, LinkedIn and Mail SVGs.
- **Terminal panel** ([src/components/terminal/terminal-panel.tsx](src/components/terminal/terminal-panel.tsx)): presentation only. Lines starting with `$ ` render as prompts, and an optional badge labels the output as Example or Simulated. `copyable` adds a `CopyButton` that copies the commands without their `$` and announces "Copied" through a live region.
- **Home sections** (`src/components/home/`):
  - `Hero`: the `h1` headline, intro, tags, adaptive buttons, and a terminal panel labelled Example. It takes `config` and `featuredCount` props so tests can inject them.
  - `FeaturedProjects`: renders nothing while no project qualifies. While `/projects` is enabled, it ends with a "View all projects" link and card titles open their case studies.
  - `ProjectCard` (`src/components/projects/`): status badge (text + icon), up to 5 technologies, and Source / Live demo / Case study links, each rendered only when it exists. Case study also requires the `/projects` route to be enabled.
  - `PipelineSection`: "Simulated" disclaimer, the interactive `PipelinePreview`, and a `<noscript>` list of all stages.
  - `SkillsSection`: one card per group. The learning group gets a dashed border and a "Currently learning" badge; individual `learning` items in other groups get a small "learning" badge.
  - `ContactSection`: one large row per configured link (icon, label, readable address). Renders nothing until a link is set.
  - Page order ([src/app/page.tsx](src/app/page.tsx)): Hero → Featured projects → Pipeline → Skills → Contact.
- **Pipeline preview** ([src/components/pipeline/pipeline-preview.tsx](src/components/pipeline/pipeline-preview.tsx)): implements the WAI-ARIA tabs pattern through the generic [`useRovingTabs`](src/lib/use-roving-tabs.ts) hook. Arrows on both axes move and wrap; Home/End jump; only the selected tab is in the Tab order. Desktop shows five connected nodes in a row; mobile stacks them. A Motion `layoutId` slides the active indicator, and the details panel fades in. Each stage shows its purpose, an explanation, a copyable command and a collapsible workflow excerpt.

## Projects directory

- **Route:** [src/app/projects/page.tsx](src/app/projects/page.tsx) renders an h1, the `directoryIntro` from `projects.ts`, and `ProjectDirectory`.
- **`ProjectDirectory`** ([src/components/projects/project-directory.tsx](src/components/projects/project-directory.tsx)): one labelled `<section>` per group (h2 + two-column card grid). The first group renders immediately; the rest fade in with `Reveal`.
- **Card links:** when the `/projects` route is enabled and a project has a `caseStudy`, both the card title and a "Case study" link point to `/projects/<slug>`. Case-study pages are addressed by **slug**; `caseStudy` only names the MDX file.
- **`isRouteEnabled(routes, href)`** in `src/lib/links.ts` is the single check for "is this page live", used by the cards and featured section.

**Adding a project:**

1. Add any new technology to `src/content/technologies.ts`.
2. Append an entry to `projects` in `src/content/projects.ts`: `slug`, `title`, one-sentence `summary`, optional `description` (case-study lead), honest `status`, `group`, technology ids, `categories`, optional `repositoryUrl` / `demoUrl` (`https` only), `featured`, optional `lastUpdated` (ISO date).
3. Optionally write a case study (next section).
4. Run `npm run check`. If the home page's featured set changes, check `e2e/home.spec.ts` still describes it.

## Case-study pages

- **Route:** [src/app/projects/[slug]/page.tsx](src/app/projects/[slug]/page.tsx). `generateStaticParams` returns `getCaseStudySlugs()`, so every case study is prerendered at build. The page loads the MDX body with a dynamic import and reads the same file to build the table of contents (`getHeadings` in [src/lib/headings.ts](src/lib/headings.ts), which uses `github-slugger` so ids match `rehype-slug`).
- **Instant navigation:** the page itself renders only the static shell (the back link). Everything that reads `params` lives in a `CaseStudy` component inside `<Suspense>`, as the Next 16 instant-navigation validation requires. Known slugs are still fully prerendered, so the fallback is practically never seen.
- **Layout:** "All projects" back link → `CaseStudyHeader` (group, title, description or summary, status, technologies, Source/Live demo, "Updated" date) → article (max 70ch) with a table of contents: a sticky sidebar on `lg+`, a collapsible "On this page" panel on smaller screens.
- **Metadata:** title, description and canonical URL per project, plus a generated OG image (`opengraph-image.tsx`) showing the project title and group. Both OG images share [src/lib/og-image.tsx](src/lib/og-image.tsx).
- **Unknown slugs → real 404:** with Cache Components the page shell streams before `notFound()` runs, which would commit a `200`. [src/proxy.ts](src/proxy.ts) (matcher `/projects/:slug`) rewrites any slug without a published case study to the static not-found page first, so the status is always `404`. Projects that only have a card (no `caseStudy`) also get a 404 at their URL.
- **Adding a case study:** create `src/content/case-studies/<name>.mdx`, set `caseStudy: "<name>"` on the project, and run `npm test`. The registry test fails if a file is missing, orphaned, or if no case study exists at all (Cache Components needs at least one static param).

## Writing case studies (MDX)

Case studies are MDX files in `src/content/case-studies/`. Plain Markdown is styled automatically through [src/mdx-components.tsx](src/mdx-components.tsx): headings (`##` get ids for the table of contents), paragraphs, lists, block quotes, tables (GFM), inline code, and links (external links open in a new tab via `AppLink`). Fenced code blocks become a `CodeBlock`: Shiki highlighting, the language as the panel title, and a copy button.

Components available without importing:

| Component | Use                                                                                                                                                                      | Example                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Callout` | Note / warning / simulated aside, labelled in text                                                                                                                       | `<Callout kind="warning">Rotate the token.</Callout>`                                                                                                                    |
| `Figure`  | Image with required `alt` and `caption` (files in `public/case-studies/<slug>/`)                                                                                         | `<Figure src="/case-studies/x/flow.png" alt="…" caption="…" width={1200} height={600} />`                                                                                |
| `Diagram` | Boxes-and-arrows architecture diagram; nodes are box centres in viewBox units, edges are directed with optional labels. Generates a text description for screen readers. | `<Diagram title="Build flow" width={640} height={110} nodes={[{ id: "a", label: "Git push", x: 100, y: 70 }, …]} edges={[{ from: "a", to: "b", label: "triggers" }]} />` |

Code-fence filenames (` ```yaml title="ci.yml" `) are **not** supported: Turbopack only accepts serializable Shiki options, so the panel shows the language instead.

Wide content scrolls inside its own **`ScrollArea`** ([src/components/ui/scroll-area.tsx](src/components/ui/scroll-area.tsx)), a focusable, labelled region, so keyboard users can scroll it and the page itself never overflows. Tables (min width 36rem) and diagrams use it automatically; Shiki code blocks are already focusable.

## SEO and metadata

- Title template `%s · Adriano Matoba Lipski`; the description is the tagline.
- `robots` is `noindex, nofollow` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Set that on production only.
- `metadataBase` and the canonical URL come from `NEXT_PUBLIC_SITE_URL`. See [.env.example](.env.example).
- The Open Graph image ([src/app/opengraph-image.tsx](src/app/opengraph-image.tsx)) and favicon ([src/app/icon.tsx](src/app/icon.tsx)) are generated with `ImageResponse` at build time. Their hex values mirror the dark tokens, because CSS variables aren't available there.
- [src/app/not-found.tsx](src/app/not-found.tsx) renders the 404 page.

## Continuous integration

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every pull request and every push to `main`:

| Job       | Steps                                                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quality` | `npm ci`, lint, route types + typecheck, format check, unit tests, actionlint (workflows, with shellcheck), hadolint (Dockerfile)                                                                             |
| `e2e`     | `npm ci`, cached Playwright Chromium, full Playwright suite (both projects, axe) against a production build; report uploaded on failure                                                                       |
| `image`   | Build the Docker image (GHA layer cache), `scripts/smoke-container.sh` against it, Trivy scan (SARIF to code scanning; fails on fixable CRITICAL/HIGH). On `main`, keeps the tested image as a 1-day artifact |
| `publish` | `main` pushes only, after `quality`, `e2e` and `image` pass: loads that exact image and pushes it to `ghcr.io/dr1co/portfolio` as `sha-<7>` and `main`                                                        |

- Permissions default to `contents: read`. Only `image` adds `security-events: write` (scan upload), and only `publish` adds `packages: write` (GHCR via `GITHUB_TOKEN`). Superseded PR runs are cancelled; `main` runs always finish.
- **Image tags:** `sha-<7>` is the immutable release identifier; `main` follows the latest publish. There is no `latest`. The image's `org.opencontainers.image.revision` label holds the full commit.
- Third-party actions are pinned to full commit SHAs (`# vX.Y.Z` comment), and the linter and Trivy images by digest. Node, npm and Playwright setup live in the local composite action [.github/actions/setup](.github/actions/setup/action.yml).
- On pull requests, `github.sha` is GitHub's temporary merge commit, so PR images and their footer version point at that commit, not the branch head. Published images come from `main`, where it is the real commit.
- `quality` and `e2e` are the required checks on `main`.
- Run the same linters locally with the release binaries (no Docker needed): [actionlint](https://github.com/rhysd/actionlint/releases), [shellcheck](https://github.com/koalaman/shellcheck/releases) (actionlint uses it for `run:` scripts) and [hadolint](https://github.com/hadolint/hadolint/releases).

## Docker image

The [Dockerfile](Dockerfile) builds a production image around Next's standalone server. Vercel serves the live site; the image is a verified artifact that runs anywhere Docker does.

- **Stages:** `deps` (`npm ci`) → `build` (`BUILD_STANDALONE=1 npm run build`) → `runtime` (only `.next/standalone` and `.next/static`, on `node:24-alpine` pinned by digest).
- **Runtime:** runs as the `node` user on port 3000, `HEALTHCHECK` = `GET /` answers 200 (via Node's `fetch`; the image has no curl).
- **Build args:** `COMMIT_SHA` (footer version and the `org.opencontainers.image.revision` label) and `NEXT_PUBLIC_SITE_URL`. Both are inlined at build, so one image serves one origin. Indexing is never enabled in the image.
- **Build context** is an allowlist ([.dockerignore](.dockerignore)): config files, `src/` without tests, and `public/`. No `.env` file can reach a layer. A new root config file that the build needs must be added there.
- `output: "standalone"` is switched on only by `BUILD_STANDALONE=1`, so `npm start`, Playwright and Vercel use the regular output. `outputFileTracingIncludes` keeps the case-study MDX in the standalone bundle, because the page reads it from disk.

```bash
docker build --build-arg COMMIT_SHA="$(git rev-parse HEAD)" -t portfolio .
docker run --rm -p 3000:3000 portfolio     # http://localhost:3000
npm run docker:smoke                       # build + health + non-root + @smoke checks
npm run docker:smoke -- ghcr.io/dr1co/portfolio:sha-abc1234   # test an existing image
```

## Testing

- **Unit and component tests** sit next to the code they cover (`foo.ts` → `foo.test.ts`) and test behavior through the public interface.
- **End-to-end tests** live in `e2e/`. Playwright runs `npm run build && npm start -p 3100`, with two projects: `desktop-chromium` and `mobile-chromium` (Pixel 7). Make sure nothing else is listening on port 3100, otherwise Playwright reuses that server.

  | Spec               | Covers                                                                                                                                                                                                |
  | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `smoke.spec.ts`    | `@smoke`: `/` is English HTML with one `h1`, `/projects` and a case study answer 200, unknown slugs 404, robots matches the deployment, footer shows the expected commit                              |
  | `home.spec.ts`     | single `h1`, sections present, hero buttons scroll to Projects / Contact, "View all projects", card title → case study, **axe** in both themes                                                        |
  | `projects.spec.ts` | directory groups and nav state, case study header/TOC/back link, section marked current, per-page title and OG image, 404 for unknown and card-only slugs, no mobile overflow, **axe** in both themes |
  | `pipeline.spec.ts` | keyboard navigation, workflow excerpt, copy-to-clipboard confirmation                                                                                                                                 |
  | `theme.spec.ts`    | follows the OS, persists across reloads, no wrong-theme flash                                                                                                                                         |
  | `site.spec.ts`     | 404 page, `noindex`, title and OG tags, generated images, skip link                                                                                                                                   |
  | `mobile.spec.ts`   | no horizontal overflow, stacked pipeline, mobile menu (open, Escape, link click)                                                                                                                      |

  Some expectations depend on content (hero buttons exist only while projects and contact links are configured). If you remove content, update the specs with it.

- **Smoke checks against a deployment.** The `@smoke` tests also run against an already running site (the container, a Vercel preview, production). Setting `BASE_URL` turns off Playwright's own build and server:

  ```bash
  BASE_URL=https://example.vercel.app EXPECTED_SHA=<commit> npm run test:smoke
  ```

  | Variable                          | Effect                                                                        |
  | --------------------------------- | ----------------------------------------------------------------------------- |
  | `BASE_URL`                        | Target origin; no local build or server is started                            |
  | `EXPECTED_SHA`                    | The footer must show `Version <sha7>`; that check is skipped when unset       |
  | `EXPECT_INDEXABLE=true`           | Robots must allow indexing (production only); otherwise `noindex` is expected |
  | `VERCEL_AUTOMATION_BYPASS_SECRET` | Sent as `x-vercel-protection-bypass` to get past Vercel Deployment Protection |

- **Dev-only validation:** `next dev` checks every route for instant navigation and reports `params` read outside `<Suspense>` (message `instant-shell-url-data`). Keep routes free of these warnings; the case-study page shows the pattern.

- The project follows test-driven development: write a failing test, make it pass, repeat.

## Contributing

1. Read [AGENTS.md](AGENTS.md) for conventions: TDD, KISS, minimal comments, tokens-only colors, content as data.
2. Make sure `npm run check` passes. Also run `npm run build` and `npm run test:e2e` when routes or rendering change.
3. Keep this README and the relevant `docs/` files up to date in the same change.

## Next.js 16 notes

- **Cache Components:** reading the current time or a random value while rendering fails prerendering. Use a `'use cache'` function or `connection()`.
- **Activity:** routes you navigate away from stay mounted but hidden. Transient UI must reset itself, and tests must use visibility-aware locators.
- **MDX under Turbopack:** remark/rehype plugins are configured in `next.config.ts` **by name (strings) with serializable options only**, because functions can't cross into Turbopack. `src/mdx-components.tsx` is required by `@next/mdx`.
- **Dynamic routes:** `generateStaticParams` must return at least one param, `dynamicParams` is not allowed, and `notFound()` after streaming starts keeps a `200`. Hence the registry test (at least one case study) and `src/proxy.ts`.
- **Instant navigation:** `params` reads belong inside `<Suspense>` so client navigations have an instant shell (see "Case-study pages").
- **Shiki theming:** with `defaultColor: false`, every token carries `--shiki-light` / `--shiki-dark` variables; `globals.css` picks one based on `data-theme`.
- The bundled docs in `node_modules/next/dist/docs/` are the reference for this version.

## Known limitations

- On wide screens the case-study table of contents comes after the article in the Tab order (it mirrors the visual order); on smaller screens the collapsible "On this page" panel sits before the article.
- Content (projects, skills, pipeline copy, the thesis case study) is not final. It's tracked with `TODO(content)` markers and [docs/prepublish-checklist.md](docs/prepublish-checklist.md).
- `/lab` and `/about` don't exist yet; their nav items stay hidden until the routes are enabled in `site-config.ts`.
- The projects directory has no filters (deferred until there are ≥ 6 published projects).
- The pipeline preview is select-to-reveal only. The full simulated explorer (run, pass/fail states) is planned for `/lab`.
- No Docker image, CI workflow or deployment for this site yet (Phase 4 of the spec).
