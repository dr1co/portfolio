# adriano.dev — DevOps & Automation Portfolio

[![CI](https://github.com/dr1co/portfolio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dr1co/portfolio/actions/workflows/ci.yml)

Personal portfolio for **Adriano Matoba Lipski**: a professional profile and a small technical lab that explains how code gets from a commit to production. The goal is a site that feels like a well-built developer tool. It favours evidence over claims and never presents simulated data as real.

- Product requirements: [docs/features-specification.md](docs/features-specification.md)
- Visual identity ("Terminal Modern"): [docs/visual-identity.md](docs/visual-identity.md)
- Feature plans: [docs/homepage-plan.md](docs/homepage-plan.md) (home page, done), [docs/projects-plan.md](docs/projects-plan.md) (projects directory and case studies, done) and [docs/delivery-plan.md](docs/delivery-plan.md) (CI/CD and deployment, done)
- Operations runbook (deploy, verify, roll back, rotate secrets): [docs/operations.md](docs/operations.md)
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
| `/projects/[slug]` case studies                     | Done; thesis and Django template case studies drafted from their repos, awaiting review          |
| CI/CD: checks, Docker image on GHCR, Vercel deploys | Done; see [docs/operations.md](docs/operations.md)                                               |
| `/lab` and the Pipeline Explorer                    | Done; copy drafted from `ci.yml`, awaiting review                                                |
| Brazilian Portuguese (`/pt-br`), hreflang, sitemap  | Done; translations reviewed                                                                      |
| `/about`                                            | Not started                                                                                      |

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
  app/                global styles and tokens, the global 404, sitemap.xml
    [lang]/           root layout and every route (/, /projects, /projects/[slug], /lab, /lab/pipeline), OG images, favicon
  i18n/               locales, path helpers, `localize`, UI messages, the client locale context
  components/         UI grouped by domain: layout, navigation, theme, home, projects, pipeline, lab, terminal, mdx, ui
  content/            typed content: projects, technologies, skills, pipeline stages, Lab demos, the model of ci.yml
    case-studies/     one MDX file per case study
  lib/                site config and small pure helpers (links, headings, OG layout, pipeline run model, hooks)
  test/               shared test helpers (e.g. stubMatchMedia)
  mdx-components.tsx  Markdown element → component mapping for case studies
  proxy.ts            maps public URLs to app/[lang] routes; unknown case-study slugs get a real 404
e2e/                  Playwright specs
docs/                 specs, feature plans and the pre-publish checklist
```

Content (text, links, projects, case studies) is kept separate from components, so updating the site usually means editing `src/content/` or `src/lib/site-config.ts` only. Interface text (buttons, labels, headings) lives in `src/i18n/messages/`. See [Routing and languages](#routing-and-languages).

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

| File                                           | Holds                                                                                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [projects.ts](src/content/projects.ts)         | `projects` list and the ordered `projectGroups` (DevOps and Delivery → Backend and Automation → Machine Learning and AI) | Every project has one `group`; `categories` are tags. Planned projects are never published, and non-`https` links are stripped. Helpers take a locale: `getFeaturedProjects(locale)` (home, max 4), `getProjectDirectory(locale)` (groups in order, empty ones dropped, sorted featured → status → title), `getProject(slug, locale)` (only projects with a case study). `getCaseStudySlugs()` is the same in every language. |
| [skills.ts](src/content/skills.ts)             | Skill groups                                                                                                             | Each skill has a `since` year (shown as experience) and an optional `note`. Technologies not yet used in a substantive project go in the `learning: true` group, without `since`; a test enforces both rules.                                                                                                                                                                                                                 |
| [technologies.ts](src/content/technologies.ts) | Canonical technology id → display name map                                                                               | Projects (`technologies`) and skills (`tech`) reference ids, so names are spelled the same everywhere. A typo fails `typecheck`. Add new technologies here first, then map the logo in [src/lib/tech-icons.ts](src/lib/tech-icons.ts) if Simple Icons has one.                                                                                                                                                                |
| [pipeline.ts](src/content/pipeline.ts)         | The five illustrative pipeline stages (command + workflow excerpt)                                                       | Icons are string keys, because the data is passed to a client component.                                                                                                                                                                                                                                                                                                                                                      |
| [lab.ts](src/content/lab.ts)                   | Lab intro and demo cards                                                                                                 | Each demo has an objective, concepts, a `mode` (`simulated` / `live`), optional prerequisites and source link, and its own `/lab/<slug>` route.                                                                                                                                                                                                                                                                               |
| [lab-pipeline.ts](src/content/lab-pipeline.ts) | The Pipeline Explorer's model of `.github/workflows/ci.yml`: trigger, jobs, steps, excerpts, scenarios                   | Kept in sync with `ci.yml` by a drift test (see [Lab](#lab)). Only the prose (`purpose`, `explanation`, scenario summaries, page intro) is free to edit.                                                                                                                                                                                                                                                                      |

Texts that change with the language are `Localized` (`{ en: "…" }`). Each file exports a `getX(locale)` accessor (`getSiteConfig`, `getProjects`, `getSkillGroups`, `getPipelineStages`, `getLabDemos`, `getLabPipeline`) that returns the data with plain strings, so components never see `Localized` values. Ids, URLs, commands, workflow excerpts and step names are not translated.

Unreviewed content is marked `// TODO(content):`. List it with `grep -rn "TODO(content)" src`.

## Layout and shared components

- **Root layout** ([src/app/[lang]/layout.tsx](src/app/[lang]/layout.tsx)) sets `<html lang>` from the `lang` root param and renders `SiteDocument` ([src/components/layout/site-document.tsx](src/components/layout/site-document.tsx)), in render order: skip link, sticky header, `<main id="main">`, footer. The theme and Motion (`reducedMotion="user"`) providers wrap everything. `SiteDocument` also owns the fonts and the `globals.css` import, because the global 404 page renders it too.
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
  - `Tooltip`: a focusable graphic with a tooltip. CSS fades it in on hover, focus or tap (150 ms, instant with reduced motion), so it works without JavaScript; a small client handler lets Escape dismiss it (WCAG 1.4.13). It opens below the graphic and spans the nearest positioned ancestor, so it never overflows the viewport.
- **Terminal panel** ([src/components/terminal/terminal-panel.tsx](src/components/terminal/terminal-panel.tsx)): presentation only. Lines starting with `$ ` render as prompts, and an optional badge labels the output as Example or Simulated. `copyable` adds a `CopyButton` that copies the commands without their `$` and announces "Copied" through a live region.
- **Home sections** (`src/components/home/`):
  - `Hero`: the `h1` headline, intro, tags, adaptive buttons, and a terminal panel labelled Example. It takes `config` and `featuredCount` props so tests can inject them.
  - `FeaturedProjects`: renders nothing while no project qualifies. While `/projects` is enabled, it ends with a "View all projects" link and card titles open their case studies.
  - `ProjectCard` (`src/components/projects/`): status badge (text + icon), up to 5 technologies, and Source / Live demo / Case study links, each rendered only when it exists. Case study also requires the `/projects` route to be enabled.
  - `PipelineSection`: "Simulated" disclaimer, the interactive `PipelinePreview`, a `<noscript>` list of all stages, and (while `/lab` is enabled) a link to the Pipeline Explorer.
  - `SkillsSection`: one card per group, each technology a logo tile from [Simple Icons](https://simpleicons.org) (via [`techIcon`](src/lib/tech-icons.ts)). Tiles take the brand colour in each theme where it reaches 3:1 on the tile, and the theme's foreground colour where it doesn't. A technology without a logo shows its name as text. Hovering, focusing or tapping a tile shows a `Tooltip` with the experience (computed from `since` and the cached [`currentYear`](src/lib/current-year.ts)) and an optional `note`. The learning group gets dashed borders and a "Currently learning" badge, and its tooltips say "Currently learning" instead of years. The section is an async server component, and the testable markup lives in `SkillGrid`, which takes `year` as a prop.
  - `ContactSection`: one large row per configured link (icon, label, readable address). Renders nothing until a link is set.
  - Page order ([src/app/[lang]/page.tsx](src/app/[lang]/page.tsx)): Hero → Featured projects → Pipeline → Skills → Contact.
- **Pipeline preview** ([src/components/pipeline/pipeline-preview.tsx](src/components/pipeline/pipeline-preview.tsx)): implements the WAI-ARIA tabs pattern through the generic [`useRovingTabs`](src/lib/use-roving-tabs.ts) hook. Arrows on both axes move and wrap; Home/End jump; only the selected tab is in the Tab order. Desktop shows five connected nodes in a row; mobile stacks them. A Motion `layoutId` slides the active indicator, and the details panel fades in. Each stage shows its purpose, an explanation, a copyable command and a collapsible workflow excerpt.

## Projects directory

- **Route:** [src/app/[lang]/projects/page.tsx](src/app/[lang]/projects/page.tsx) renders an h1, the `directoryIntro` from `projects.ts`, and `ProjectDirectory`.
- **`ProjectDirectory`** ([src/components/projects/project-directory.tsx](src/components/projects/project-directory.tsx)): one labelled `<section>` per group (h2 + two-column card grid). The first group renders immediately; the rest fade in with `Reveal`.
- **Card links:** when the `/projects` route is enabled and a project has a `caseStudy`, both the card title and a "Case study" link point to `/projects/<slug>`. Case-study pages are addressed by **slug**; `caseStudy` only names the MDX file.
- **`isRouteEnabled(routes, href)`** in `src/lib/links.ts` is the single check for "is this page live", used by the cards and featured section.

**Adding a project:**

1. Add any new technology to `src/content/technologies.ts`.
2. Append an entry to `projects` in `src/content/projects.ts`: `slug`, `title`, one-sentence `summary`, optional `description` (case-study lead), honest `status`, `group`, technology ids, `categories`, optional `repositoryUrl` / `demoUrl` (`https` only), `featured`, optional `lastUpdated` (ISO date).
3. Optionally write a case study (next section).
4. Run `npm run check`. If the home page's featured set changes, check `e2e/home.spec.ts` still describes it.

## Case-study pages

- **Route:** [src/app/[lang]/projects/[slug]/page.tsx](src/app/[lang]/projects/[slug]/page.tsx). `generateStaticParams` returns `getCaseStudySlugs()`, so every case study is prerendered at build. The page loads the MDX body with a dynamic import and reads the same file to build the table of contents (`getHeadings` in [src/lib/headings.ts](src/lib/headings.ts), which uses `github-slugger` so ids match `rehype-slug`).
- **Instant navigation:** the page itself renders only the static shell (the back link). Everything that reads `params` lives in a `CaseStudy` component inside `<Suspense>`, as the Next 16 instant-navigation validation requires. Known slugs are still fully prerendered, so the fallback is practically never seen.
- **Layout:** "All projects" back link → `CaseStudyHeader` (group, title, description or summary, status, technologies, Source/Live demo, "Updated" date) → article (max 70ch) with a table of contents: a sticky sidebar on `lg+`, a collapsible "On this page" panel on smaller screens.
- **Metadata:** title, description and canonical URL per project, plus a generated OG image (`opengraph-image.tsx`) showing the project title and group. Both OG images share [src/lib/og-image.tsx](src/lib/og-image.tsx).
- **Unknown slugs → real 404:** with Cache Components the page shell streams before `notFound()` runs, which would commit a `200`. [src/proxy.ts](src/proxy.ts) rewrites any slug without a published case study to a path no route serves (`UNROUTED_PATH`, `/en/__unrouted`) before rendering. Both `next start` and Vercel answer that with the not-found page and a `404`. Don't rewrite to `/404` instead: Vercel serves that static file with a `200` when it's a rewrite target, because its `/404 → 404` status route runs before middleware. The `@smoke` check against each preview catches a regression. Projects that only have a card (no `caseStudy`) also get a 404 at their URL.
- **Adding a case study:** create `src/content/case-studies/<name>.mdx`, set `caseStudy: "<name>"` on the project, and run `npm test`. The registry test fails if a file is missing, orphaned, or if no case study exists at all (Cache Components needs at least one static param).

## Writing case studies (MDX)

Case studies are MDX files in `src/content/case-studies/`. Plain Markdown is styled automatically through [src/mdx-components.tsx](src/mdx-components.tsx): headings (`##` get ids for the table of contents), paragraphs, lists, block quotes, tables (GFM), inline code, and links (external links open in a new tab via `AppLink`). Fenced code blocks become a `CodeBlock`: Shiki highlighting, the language as the panel title, and a copy button.

Components available without importing:

| Component | Use                                                                                                                                                                      | Example                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Callout` | Note / warning / simulated aside, labelled in text                                                                                                                       | `<Callout kind="warning">Rotate the token.</Callout>`                                                                                                                    |
| `Figure`  | Image with required `alt` and `caption` (files in `public/case-studies/<slug>/`)                                                                                         | `<Figure src="/case-studies/x/flow.png" alt="…" caption="…" width={1200} height={600} />`                                                                                |
| `Diagram` | Boxes-and-arrows architecture diagram; nodes are box centres in viewBox units, edges are directed with optional labels. Generates a text description for screen readers. | `<Diagram title="Build flow" width={640} height={110} nodes={[{ id: "a", label: "Git push", x: 100, y: 70 }, …]} edges={[{ from: "a", to: "b", label: "triggers" }]} />` |

**Languages:** each case study has one file per language: `<name>.mdx` (English) and `<name>.pt-br.mdx`. `caseStudyFile(name, locale)` in [src/content/projects.ts](src/content/projects.ts) picks the file, and `case-studies.test.ts` fails if a language is missing or a file has no project. Translate the prose, headings, `Diagram` titles and labels, and `Callout` text; keep code blocks, commands and paths as they are. Heading ids come from the translated text, so anchors differ per language. Diagram boxes are 150 units wide: keep labels to about 20 characters.

Code-fence filenames (` ```yaml title="ci.yml" `) are **not** supported: Turbopack only accepts serializable Shiki options, so the panel shows the language instead.

Wide content scrolls inside its own **`ScrollArea`** ([src/components/ui/scroll-area.tsx](src/components/ui/scroll-area.tsx)), a focusable, labelled region, so keyboard users can scroll it and the page itself never overflows. Tables (min width 36rem) and diagrams use it automatically; Shiki code blocks are already focusable.

## Lab

`/lab` lists interactive demos as cards ([src/app/[lang]/lab/page.tsx](src/app/[lang]/lab/page.tsx), data in `src/content/lab.ts`). Every demo says whether it is simulated or live. The first demo is the **Pipeline Explorer** at `/lab/pipeline`.

### Pipeline Explorer

The Explorer models **this site's real CI workflow** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) job by job. Execution is simulated: outcomes are derived from the model, and nothing calls GitHub. The page says so next to its title and links to the real runs.

- **Model** ([src/content/lab-pipeline.ts](src/content/lab-pipeline.ts)): a trigger, six jobs (`needs`, the events they run on, every step, a verbatim YAML excerpt) and four scenarios. A scenario only states its event and, optionally, the step that fails. Fork PRs, cancelled runs and real durations aren't modeled.
- **Run model** ([src/lib/pipeline-run.ts](src/lib/pipeline-run.ts), pure functions):
  - `resolveRun` derives each job's final state and reason. A job is skipped when its event doesn't match ("Runs only on pull requests.") or when a job it needs failed or was skipped.
  - Step states follow the failing step, `if: failure()` steps and event-limited steps.
  - `runFrames` builds the playback timeline (all pending, then each dependency level running and finishing).
  - `describeFrame` and `summarizeRun` write the live-region text.
- **UI** ([src/components/lab/pipeline-explorer.tsx](src/components/lab/pipeline-explorer.tsx)):
  - A scenario picker (native radios), then the trigger and jobs in dependency columns.
  - From `lg` up, the graph is a WAI-ARIA tablist (`useRovingTabs` in controlled mode) with the details panel and Previous/Next below. Below `lg`, it's an accordion: each job is a button with `aria-expanded`, and its details open right under it. The mode comes from `useMediaQuery`, the layout from CSS, so nothing shifts on hydration.
  - `JobPanel` shows the purpose, the simulated outcome and reason, `needs` and events in words, a step checklist and the YAML excerpt.
  - Without JavaScript, a `<noscript>` table lists every job's outcome in every scenario.
- **Playback** ([src/lib/use-pipeline-playback.ts](src/lib/use-pipeline-playback.ts)): Run, Pause/Resume and Reset over `runFrames`, one frame every `TICK_MS` (800 ms).
  - The selection follows the running jobs, but focus never moves.
  - Choosing a job, Previous/Next or an accordion header pauses the run. Changing the scenario or Reset returns to the final outcomes.
  - With `prefers-reduced-motion`, Run jumps straight to the end and the running icon doesn't spin.
  - The run pauses when the route is hidden by `<Activity>`.
  - A `role="status"` line announces each frame.
- **Drift test** ([src/content/lab-pipeline.drift.test.ts](src/content/lab-pipeline.drift.test.ts)) parses `ci.yml` and checks:
  - the job ids, every `needs`, and each job's and step's `if:` (through a `CONDITIONS` mapping table);
  - every step name, in order (unnamed steps are named like GitHub does: the action without its `@ref`, or the command);
  - that excerpt lines appear verbatim in `ci.yml` (trimmed; `# …` marks a gap), with no pinned SHAs or digests, so Dependabot bumps don't break it.

**When the drift test fails** after a `ci.yml` change, update `src/content/lab-pipeline.ts` in the same change: jobs, `needs`, `events`, step names and excerpts. A new `if:` expression also needs an entry in the test's `CONDITIONS` table. If the model can't express it, simplify the job and mention it in `pipelineScope`.

**Adding a demo:** add a `LabDemo` to `src/content/lab.ts` with `href: "/lab/<slug>"`, create the static route `src/app/[lang]/lab/<slug>/page.tsx` with `alternates: canonicalFor("/lab/<slug>")`, and label it Simulated unless it's backed by a real service. `lab.test.ts` and the `@smoke` Lab test pick it up from `labDemos`.

## SEO and metadata

- Title template `%s · Adriano Matoba Lipski`; the description is the tagline.
- `robots` is `noindex, nofollow` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Set that on production only.
- `metadataBase`, the canonical URL and the `hreflang` alternates come from `NEXT_PUBLIC_SITE_URL`. See [.env.example](.env.example). Each page sets its own with `canonicalFor(path, locale)` ([src/lib/canonical.ts](src/lib/canonical.ts)): the canonical is the page in its own language (`/pt-br/lab` on the Portuguese page), and `languages` lists `en`, `pt-BR` and `x-default` (English). The root layout sets none, because Next merges metadata shallowly and layout alternates would leak into every page that doesn't override them. Without a site URL, neither is emitted. The `@smoke` suite checks that each canonical points at its own page and each `hreflang` at the right translation.
- Open Graph: `og:locale` is `en_US` or `pt_BR`, with the other language as `og:locale:alternate`. Titles and descriptions follow the page's language.
- [src/app/sitemap.ts](src/app/sitemap.ts) serves `/sitemap.xml`: every published page (enabled routes, case studies, Lab demos) in both languages, each with its `hreflang` alternates. The entries come from `sitemapEntries` in [src/lib/sitemap.ts](src/lib/sitemap.ts). URLs use `NEXT_PUBLIC_SITE_URL`, or `http://localhost:3000` until it's set.
- The Open Graph images ([src/app/[lang]/opengraph-image.tsx](src/app/[lang]/opengraph-image.tsx), and one per case study) and the favicon ([src/app/[lang]/icon.tsx](src/app/[lang]/icon.tsx)) are generated with `ImageResponse` at build time, once per language. The OG images use `generateImageMetadata` so their `alt` text is translated too; that puts an id segment in their URL (`/pt-br/opengraph-image/default`). Their hex values mirror the dark tokens, because CSS variables aren't available there.
- The 404 page body is `NotFoundView` ([src/components/layout/not-found-view.tsx](src/components/layout/not-found-view.tsx)). [src/app/global-not-found.tsx](src/app/global-not-found.tsx) shows it for URLs no route matches (Next's experimental `globalNotFound`, needed because the root layout sits under `[lang]`), and [src/app/[lang]/not-found.tsx](src/app/[lang]/not-found.tsx) for `notFound()` inside a route.

## Routing and languages

Every route lives under `src/app/[lang]`, and the root layout's `generateStaticParams` prerenders each locale in [src/i18n/locales.ts](src/i18n/locales.ts): English (`en`, the default) and Brazilian Portuguese (`pt-br`). English pages have no URL prefix; Portuguese pages keep theirs and the English path segments (`/pt-br/projects`). [src/proxy.ts](src/proxy.ts) maps public URLs to the internal route:

| Request                       | Proxy                                                  |
| ----------------------------- | ------------------------------------------------------ |
| `/projects`                   | rewrite to `/en/projects`                              |
| `/en/projects`                | `308` to `/projects`, one public URL per page          |
| `/en/opengraph-image/default` | untouched: Next generates these image URLs itself      |
| `/pt-br/projects`             | served as is                                           |
| `/projects/<unknown slug>`    | rewrite to `UNROUTED_PATH` → 404 (same under `/pt-br`) |

There is no automatic language detection. The header's `LanguageSwitch` ("PT" / "EN") links to the same page in the other language; its href is rendered on the server, so it works without JavaScript. Its accessible name starts with the visible text ("PT — Ver em português", WCAG 2.5.3), and it carries `hreflang` and `lang`. `<html lang>` uses the BCP 47 tag from `languageTags` (`en`, `pt-BR`).

Client code that compares paths (e.g. `NavLink`) must use `stripLocale`, because prerendered pages report their internal `/en/...` path to `usePathname`.

How text gets its language:

| Kind of text                                  | Where it lives                                                                                                                | How a component gets it                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Interface text (labels, headings, sentences)  | [src/i18n/messages/en.ts](src/i18n/messages/en.ts); every locale has the same shape                                           | `getMessages(locale)`, or `useMessages()` in a client component |
| Content (projects, skills, Lab prose, config) | `Localized` fields in `src/content/` and `site-config.ts`                                                                     | the file's `getX(locale)` accessor, which calls `localize`      |
| Case-study bodies                             | `src/content/case-studies/<name>.mdx` and `<name>.pt-br.mdx`; MDX components get their labels from `getMdxComponents(locale)` | the case-study page passes `components` to the MDX body         |

Every `Localized` field and every message needs a Portuguese version, or typecheck fails. [src/i18n/translations.test.ts](src/i18n/translations.test.ts) also fails when a Portuguese text is identical to the English one; names and terms that are meant to stay in English go in its `SAME_IN_BOTH` allowlist.

Messages with a value in them (e.g. `version: (commit) => ...`) are functions, so each language can word the sentence its own way.

The locale reaches components in one of three ways:

- **Pages and layouts** call `getLocale()` from [src/i18n/server.ts](src/i18n/server.ts), which reads `lang()` from `next/root-params`.
- **Server components, and components without a directive,** take a `locale` prop. Metadata image routes (`opengraph-image.tsx`) read `params.lang` instead, because root params aren't available there.
- **Client components** call `useLocale()` or `useMessages()`. `SiteDocument` provides the locale through `LocaleProvider`.

Unit tests render without a provider, which means English.

`AppLink` keeps visitors in their language: pass internal paths without a locale (`/projects`), and it prefixes them with `localizePath`. The default locale stays unprefixed.

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
- **Dependabot** ([.github/dependabot.yml](.github/dependabot.yml)) opens weekly PRs for:
  - npm, with a 7-day cooldown on new releases. `next`, `@next/*` and `eslint-config-next` are grouped so they stay in lockstep, and other minor/patch updates come as one PR.
  - GitHub Actions, in the workflows and the composite action, grouped.
  - The `node:24-alpine` base image digest.
    Node majors (the base image and `@types/node`) are ignored, because they move together with `.nvmrc` and Vercel's Node setting. The actionlint, hadolint and Trivy images run via `docker run` in the workflow, so Dependabot can't see them; bump their tag and digest by hand.
- **Deployments (Vercel):**
  - Vercel's Git auto-deploy is off ([vercel.json](vercel.json)), so only CI deploys.
  - `deploy-preview` handles same-repo PRs once `quality` passes. `deploy-production` handles `main` once `publish` has pushed the image of the same commit.
  - Both use [.github/actions/vercel-deploy](.github/actions/vercel-deploy/action.yml): `vercel pull` → `vercel build` → `vercel deploy --prebuilt`, then the `@smoke` checks against the new URL. Those checks cover the expected commit in the footer and robots matching the pulled `NEXT_PUBLIC_ALLOW_INDEXING`.
  - The URL appears on the PR or commit through GitHub environments (`preview`, `production`).
  - The CLI is a pinned `npx vercel@<version>`, not a project dependency: its builder packages would add many dev-tree advisories and slow every `npm ci`.
  - It authenticates with `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from secrets, and gets past Deployment Protection with `VERCEL_AUTOMATION_BYPASS_SECRET`.
- On pull requests, `github.sha` is GitHub's temporary merge commit, so PR images and their footer version point at that commit, not the branch head. Published images come from `main`, where it is the real commit.
- `quality` and `e2e` are the required checks on `main`.
- Run the same linters locally with the release binaries (no Docker needed): [actionlint](https://github.com/rhysd/actionlint/releases), [shellcheck](https://github.com/koalaman/shellcheck/releases) (actionlint uses it for `run:` scripts) and [hadolint](https://github.com/hadolint/hadolint/releases).

## Docker image

The [Dockerfile](Dockerfile) builds a production image around Next's standalone server. Vercel serves the live site; the image is a verified artifact that runs anywhere Docker does.

- **Stages:** `deps` (`npm ci`) → `build` (`BUILD_STANDALONE=1 npm run build`) → `runtime` (only `.next/standalone` and `.next/static`, on `node:24-alpine` pinned by digest).
- **Runtime:** runs as the `node` user on port 3000, `HEALTHCHECK` = `GET /` answers 200 (via Node's `fetch`; the image has no curl). The runtime stage deletes npm, npx, corepack and yarn: the server only needs `node`, and their bundled dependencies (e.g. `brace-expansion`, `undici`) were what failed the first Trivy scan.
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

  | Spec               | Covers                                                                                                                                                                                                                                                                                                                                                                                                   |
  | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `smoke.spec.ts`    | `@smoke`: `/` is English and `/pt-br` is `pt-BR` HTML with one `h1`, `/projects` and a case study answer 200, `/lab` and each demo answer 200 labelled Simulated, unknown slugs 404 in both languages, canonicals point at their own page, `hreflang` points at the right translation, `sitemap.xml` lists every page in both languages, robots matches the deployment, footer shows the expected commit |
  | `home.spec.ts`     | single `h1`, sections present, hero buttons scroll to Projects / Contact, "View all projects", card title → case study, pipeline → Lab link, **axe** in both themes                                                                                                                                                                                                                                      |
  | `lab.spec.ts`      | Lab card and nav state, Explorer keyboard path (desktop tabs), scenario switch, mobile accordion position, Run playback frame by frame (`page.clock`), reduced motion, Next pauses, no-JS outcome table, back link, titles, no mobile overflow, **axe** in both themes                                                                                                                                   |
  | `projects.spec.ts` | directory groups and nav state, case study header/TOC/back link, section marked current, per-page title and OG image, 404 for unknown slugs, no mobile overflow and **axe** in both themes for every case study                                                                                                                                                                                          |
  | `pipeline.spec.ts` | keyboard navigation, workflow excerpt, copy-to-clipboard confirmation                                                                                                                                                                                                                                                                                                                                    |
  | `theme.spec.ts`    | follows the OS, persists across reloads, no wrong-theme flash                                                                                                                                                                                                                                                                                                                                            |
  | `site.spec.ts`     | 404 page, `noindex`, title and OG tags (incl. `og:locale` and translated `alt` on `/pt-br`), generated images, skip link                                                                                                                                                                                                                                                                                 |
  | `mobile.spec.ts`   | no horizontal overflow, stacked pipeline, mobile menu (open, Escape, link click)                                                                                                                                                                                                                                                                                                                         |
  | `i18n.spec.ts`     | `<html lang>` per language, PT/EN switch round trip keeps the page, links stay in Portuguese, switch works without JavaScript, **axe** on every `/pt-br` page in both themes                                                                                                                                                                                                                             |

  Tests that press keys on tabs or radios call `waitForHydration` from [e2e/hydration.ts](e2e/hydration.ts) first: keys pressed before hydration reach the server HTML and are lost.

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

- **Screen-size and motion queries in unit tests:** jsdom has no media queries. `stubMatchMedia(matches)` from [src/test/match-media.ts](src/test/match-media.ts) answers them (a boolean, or a function of the query) for one test. The Explorer tests use it to pick tabs vs. accordion and reduced motion.
- **Timer-driven UI:** advance fake timers one tick per `act(...)`, because each frame's timer is scheduled only after React commits the previous one. Use `fireEvent` rather than `userEvent` under fake timers. Don't screenshot or run axe on a page under Playwright's `page.clock`, because Motion fades stay frozen.

- The project follows test-driven development: write a failing test, make it pass, repeat.

## Contributing

1. Read [AGENTS.md](AGENTS.md) for conventions: TDD, KISS, minimal comments, tokens-only colors, content as data.
2. Make sure `npm run check` passes. Also run `npm run build` and `npm run test:e2e` when routes or rendering change.
3. Keep this README and the relevant `docs/` files up to date in the same change.

## Next.js 16 notes

- **Cache Components:** reading the current time or a random value while rendering fails prerendering. Use a `'use cache'` function or `connection()`.
- **Activity:** routes you navigate away from stay mounted but hidden. Transient UI must reset itself (the Explorer pauses its run in a `useLayoutEffect` cleanup), and tests must use visibility-aware locators.
- **MDX under Turbopack:** remark/rehype plugins are configured in `next.config.ts` **by name (strings) with serializable options only**, because functions can't cross into Turbopack. `src/mdx-components.tsx` is required by `@next/mdx`.
- **Dynamic routes:** `generateStaticParams` must return at least one param, `dynamicParams` is not allowed, and `notFound()` after streaming starts keeps a `200`. Hence the registry test (at least one case study) and `src/proxy.ts`.
- **Instant navigation:** `params` reads belong inside `<Suspense>` so client navigations have an instant shell (see "Case-study pages").
- **Shiki theming:** with `defaultColor: false`, every token carries `--shiki-light` / `--shiki-dark` variables; `globals.css` picks one based on `data-theme`.
- The bundled docs in `node_modules/next/dist/docs/` are the reference for this version.

## Known limitations

- On wide screens the case-study table of contents comes after the article in the Tab order (it mirrors the visual order); on smaller screens the collapsible "On this page" panel sits before the article.
- Content (projects, skills, pipeline and Lab copy, the case studies) is not final. It's tracked with `TODO(content)` markers and [docs/prepublish-checklist.md](docs/prepublish-checklist.md).
- The Portuguese translations are drafts awaiting the owner's review (see the pre-publish checklist).
- A Portuguese URL that matches no route (e.g. `/pt-br/nope`) gets the English 404 page: unmatched URLs render `global-not-found.tsx`, which sits outside `[lang]` and can't tell the language.
- `/about` doesn't exist yet; its nav item stays hidden until the route is enabled in `site-config.ts`.
- The projects directory has no filters (deferred until there are ≥ 6 published projects).
- The Pipeline Explorer is a simplified, scripted model of `ci.yml`: no fork PRs, cancelled runs, real durations or live data from GitHub Actions. Container Explorer and an observability demo are future phases.
- The scenario and selection in the Explorer aren't in the URL, so a particular view can't be linked to.
- The Docker image is a verified, published artifact, but Vercel serves the site. The image is about 300 MB: deleting npm in the runtime stage hides it from scans but doesn't shrink the base layer.
- No SBOM, provenance attestation or image signing yet. The linter, Trivy and Vercel CLI pins aren't covered by Dependabot (see [docs/operations.md](docs/operations.md)).
- The production domain isn't chosen yet, so canonical and `hreflang` links are omitted, and `sitemap.xml` uses `http://localhost:3000`, until `NEXT_PUBLIC_SITE_URL` is set. Indexing stays off until launch. There is no `robots.txt` yet, so search engines find the sitemap only if it's submitted (e.g. in Search Console).
