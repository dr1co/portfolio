# Projects — Implementation Plan

**Feature:** Project directory (`/projects`) and case studies (`/projects/[slug]`)
**Source specs:** [features-specification.md §5](features-specification.md), [visual-identity.md §5.6–5.7](visual-identity.md)
**Branch:** `feat/projects`. The owner makes all commits. Each step ends with a suggested commit message and a green check run.
**Status:** In progress. Gate (§0) met on 2026-10-21 (Django template added, network available); Steps 0–2 done. Decisions were settled in a grilling session on 2026-10-20. Working rules (TDD, owner commits, KISS, docs in sync) are in [AGENTS.md](../AGENTS.md).

---

## 0. Gate (check before Step 1)

Implementation may start only when **all** of these hold:

- [ ] `src/content/projects.ts` contains **at least one project in the `devops` group with a valid public `https` repository URL**. The owner adds it.
- [ ] The network is available: `npm i` and `next build` both need it. The build fetches Geist from Google Fonts, and the owner decided to keep that (D4).

If either is unmet, stop and tell the owner. Don't stub DevOps projects to get past the gate.

---

## 1. Decisions

| #   | Topic                  | Decision                                                                                                                                                                                                                                                                   |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Scope                  | `/projects` directory **and** `/projects/[slug]` case studies. A case-study page exists only for projects that have one.                                                                                                                                                   |
| D2  | Positioning            | DevOps projects come first. The deep-learning thesis is shown **as-is**, as a machine-learning project.                                                                                                                                                                    |
| D3  | Gate                   | Blocked until at least one DevOps project with a repo exists (§0).                                                                                                                                                                                                         |
| D4  | Fonts                  | Keep `next/font/google`, so builds need network. No self-hosting in this plan.                                                                                                                                                                                             |
| D5  | Case-study format      | **MDX** via `@next/mdx`, one file per case study in `src/content/case-studies/<slug>.mdx`.                                                                                                                                                                                 |
| D6  | Section structure      | **Free-form.** Spec §5.2's 11 sections are guidance, not enforced.                                                                                                                                                                                                         |
| D7  | Metadata source        | `projects.ts` is the **single source** for title, status, links and so on. MDX holds only the narrative. `caseStudy` names the MDX file.                                                                                                                                   |
| D8  | Code blocks            | **Shiki at build time** (`@shikijs/rehype`, dual light/dark themes, zero client JS) inside a panel with a filename title and a copy button.                                                                                                                                |
| D9  | Diagrams               | Reusable **inline-SVG `Diagram`** built from nodes/edges data, styled with tokens, with a generated text alternative.                                                                                                                                                      |
| D10 | MDX components         | Code block, `Diagram`, `Callout` (Note / Warning / Simulated), `Figure` (`next/image` with required alt and caption).                                                                                                                                                      |
| D11 | Directory layout       | **Grouped by category**, with an ordered, fixed group list: `DevOps & Delivery` → `Backend & Automation` → `Machine Learning`. Empty groups are not rendered. Each project has exactly one `group`; `categories` remain as tags.                                           |
| D12 | Sorting within a group | Featured first, then status (Available → In progress), then title.                                                                                                                                                                                                         |
| D13 | Planned projects       | Never published (same rule as the home page).                                                                                                                                                                                                                              |
| D14 | Filters                | None. Revisit when there are ≥ 6 published projects (spec §5.1).                                                                                                                                                                                                           |
| D15 | Technology names       | A canonical **`technologies.ts`** map (id → display name). `projects.ts` **and** `skills.ts` reference ids, so a typo fails typecheck.                                                                                                                                     |
| D16 | `description`          | Optional. It's the case-study **lead paragraph** and **meta description**. `summary` stays the one-liner on cards.                                                                                                                                                         |
| D17 | `lastUpdated`          | Manual ISO date in `projects.ts`, shown only when present.                                                                                                                                                                                                                 |
| D18 | Case-study layout      | Back link to `/projects`, a metadata header (title, description, status, group, technologies, repo/demo, last updated), a **table of contents** from the h2 headings (sticky sidebar on `lg+`, `<details>` on smaller screens), then the MDX body. No previous/next links. |
| D19 | Home integration       | Enable **Projects** in the nav (which makes the mobile menu appear), add a **"View all projects"** link under Featured projects, and make the **card title link to the case study** when one exists. The hero button keeps scrolling to `#projects`.                       |
| D20 | SEO                    | `generateMetadata` per case study (title, description, canonical) plus a **generated OG image per project** that reuses the site OG design. `/projects` gets its own title and description.                                                                                |
| D21 | Thesis copy            | Claude **drafts** the thesis case study and `description` from `github.com/dr1co/tcc-engsoftware` once online, marked `TODO(content)` for review.                                                                                                                          |
| D22 | Test seams             | Agreed: content model (unit), components (unit), routes (e2e), home integration (e2e). Details in §4.                                                                                                                                                                      |

---

## 2. Next.js 16 constraints (verified in `node_modules/next/dist/docs/`)

1. **Cache Components and dynamic routes:** `generateStaticParams` must return **at least one** param, or the build fails (`api-reference/functions/generate-static-params.md`, "With Cache Components"). A content test enforces at least one case study (Step 6).
2. Unknown slugs aren't prerendered. The page calls `notFound()` when `getProject(slug)` finds no project with a case study. Check what the e2e test sees for that case.
3. **`params` is a Promise:** `const { slug } = await params`.
4. **MDX** (`guides/mdx.md`):
   - `mdx-components.tsx` is **required** and lives in `src/`.
   - Load content with a dynamic import: ``await import(`@/content/case-studies/${slug}.mdx`)``.
   - **Turbopack only accepts plugins named by string with serializable options**: e.g. `rehypePlugins: [["rehype-slug"], ["@shikijs/rehype", { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }]]`.
   - `@next/mdx` has no frontmatter support, which is fine because metadata lives in `projects.ts` (D7).
5. `next.config.ts` already has `turbopack.rules` for Tailwind. Wrap the whole config with `createMDX(...)` and keep those rules.
6. No `Date`/random calls while rendering. `lastUpdated` is a static string, so it's safe.

---

## 3. Target file tree (additions and changes)

```text
src/
  mdx-components.tsx                     NEW  maps MDX elements → components
  app/projects/
    page.tsx                             NEW  directory
    [slug]/page.tsx                      NEW  case study
    [slug]/opengraph-image.tsx           NEW  per-project OG image
  components/projects/
    project-card.tsx                     CHG  title links to case study; technology ids → names
    project-directory.tsx                NEW  group sections + cards
    case-study-header.tsx                NEW
    table-of-contents.tsx                NEW
  components/mdx/
    code-block.tsx                       NEW  Shiki <pre> in a panel + copy
    callout.tsx                          NEW
    figure.tsx                           NEW
    diagram.tsx                          NEW
  components/home/featured-projects.tsx  CHG  "View all projects"
  content/
    technologies.ts                      NEW  canonical id → display name
    projects.ts                          CHG  group field, groups list, description optional, ids, helpers
    skills.ts                            CHG  technology ids
    case-studies/
      tcc-engsoftware.mdx                NEW  drafted from the repo, TODO(content)
      <devops-project>.mdx               NEW  if the owner provides material
  lib/
    headings.ts                          NEW  extract h2s from MDX source for the TOC
    site-config.ts                       CHG  routes./projects.enabled = true
next.config.ts                           CHG  createMDX wrapper
e2e/projects.spec.ts                     NEW
e2e/home.spec.ts, e2e/mobile.spec.ts     CHG  content-state expectations, menu fixme enabled
```

---

## 4. Test seams (agreed)

| Seam             | Level | Behaviours                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content model    | unit  | Directory groups come out in fixed order with empty groups dropped; sorting follows D12; planned projects are excluded; every `caseStudy` has an MDX file **and** no MDX file is orphaned; every technology id resolves; at least one case study exists; `getProject(slug)` returns only projects that have a case study.       |
| Headings         | unit  | `getHeadings(mdxSource)` returns h2 text and slug ids in order, matching `rehype-slug` ids (`github-slugger`), and ignores `##` inside code fences.                                                                                                                                                                             |
| Components       | unit  | Directory renders group h2s and cards; card title links to the case study only when one exists; case-study header shows metadata and only valid links; TOC lists headings in order with `#id` links; `Diagram` exposes a text alternative built from its edges; `Callout` conveys its kind in text; `Figure` requires alt text. |
| Routes           | e2e   | `/projects` lists groups and cards; nav marks Projects as current; a case study renders with TOC and back link; TOC links jump to sections; an unknown slug gives 404; page title and OG tags; axe passes in both themes; no horizontal overflow with code blocks at mobile width.                                              |
| Home integration | e2e   | "View all projects" goes to `/projects`; the mobile menu appears and its `fixme` test is enabled; content-state expectations are updated (featured section visible, hero shows "Explore Projects").                                                                                                                             |

---

## 5. Implementation steps

Work test-first in vertical slices, per AGENTS.md. Each step must pass `npm run check`; steps that touch routes must also pass `npm run build` and `npm run test:e2e`.

### Step 0 — Gate and baseline

1. Verify §0. Stop if it's unmet.
2. Run `npm run format`. The owner's `projects.ts` edit currently fails `format:check`.
3. **Fix the content-state e2e expectations** that broke once the thesis became featured:
   - `e2e/home.spec.ts`: the hero primary button is now "Explore Projects" → `#projects`; `#projects` is visible.
   - Keep `#contact` hidden while links are empty.
4. `npm run check && npm run test:e2e` must be green before continuing.

Suggested commit: `[chore] update content-state e2e expectations and format projects`

### Step 1 — MDX tooling

1. `npm i @next/mdx @mdx-js/loader @mdx-js/react @shikijs/rehype shiki rehype-slug github-slugger`, plus `npm i -D @types/mdx`. Check the installed versions against the MDX guide.
2. `next.config.ts`: `import createMDX from "@next/mdx"`, then `const withMDX = createMDX({ options: { rehypePlugins: [["rehype-slug"], ["@shikijs/rehype", { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }]] } })` and `export default withMDX(nextConfig)`. Use strings only (Turbopack).
3. `src/mdx-components.tsx` with `useMDXComponents(components)` returning `components` for now (filled in Step 5).
4. Shiki dual-theme CSS in `globals.css`: by default `.shiki, .shiki span { color: var(--shiki-light); background-color: transparent }`, and under `[data-theme="dark"]` use `var(--shiki-dark)`. The panel background comes from `--surface` tokens.
5. A throwaway smoke check is acceptable only as a local experiment; don't commit it. The first real MDX file arrives in Step 6.

**Acceptance:** `npm run build` passes with the MDX plugin active.
Suggested commit: `[setup] add MDX with Shiki and heading ids`

### Step 2 — Canonical technologies

1. **Test first** (`technologies.test.ts`): every id used by `projects.ts` and `skills.ts` resolves to a display name, and display names are unique.
2. `src/content/technologies.ts`: `export const technologies = { python: "Python", pytorch: "PyTorch", tensorflow: "TensorFlow", keras: "Keras", metatrader5: "MetaTrader 5", docker: "Docker", "docker-compose": "Docker Compose", "github-actions": "GitHub Actions", django: "Django", flask: "Flask", postgresql: "PostgreSQL", git: "Git", linux: "Linux", "dev-containers": "Dev Containers", kubernetes: "Kubernetes", terraform: "Terraform", aws: "AWS", ... } as const satisfies Record<string, string>`, plus `export type TechnologyId = keyof typeof technologies` and `techName(id)`.
3. Refactor `skills.ts` (`Skill.name` → `Skill.tech: TechnologyId`) and `projects.ts` (`technologies: readonly TechnologyId[]`). Update `SkillsSection`, `ProjectCard` and their tests to render `techName(id)`. Hero tags stay free text in `site-config` (they include "CI/CD", which is a practice, not a technology).

Suggested commit: `[refactor] canonical technology names for projects and skills`

### Step 3 — Project model and directory helpers

1. **Tests first** (`projects.test.ts`), one slice at a time:
   - `getProjectDirectory(list)` returns `{ group, projects }[]` in group order, drops empty groups, excludes `planned`, and sorts per D12.
   - `getProject(slug, list)` returns the project only if it has a `caseStudy`.
   - `getCaseStudySlugs(list)` returns the slugs of projects with a case study.
2. Schema changes in `projects.ts`:
   ```ts
   export const projectGroups = [
     { id: "devops", title: "DevOps & Delivery" },
     { id: "backend", title: "Backend & Automation" },
     { id: "ml", title: "Machine Learning" },
   ] as const;
   export type ProjectGroupId = (typeof projectGroups)[number]["id"];
   // Project: + group: ProjectGroupId; description?: string; technologies: readonly TechnologyId[]
   ```
3. Move the thesis to `group: "ml"` and convert its technologies to ids. Leave `caseStudy` unset until Step 6, which adds the MDX file, the `caseStudy` reference and the registry test together.
4. Keep `getFeaturedProjects` behaviour unchanged (home tests must stay green).

Suggested commit: `[feat.] project groups, directory and case-study helpers`

### Step 4 — `/projects` directory page

1. **E2E first** (`e2e/projects.spec.ts`): `/projects` shows an h1 "Projects", a group h2 per non-empty group in order, the cards, and the nav item "Projects" with `aria-current="page"`.
2. **Unit first** (`project-directory.test.tsx`): group h2s and cards per group. `project-card.test.tsx` gets new cases: the title is a link to `/projects/<slug>` when the project has a case study and the route is enabled, plain text otherwise.
3. `components/projects/project-directory.tsx` (server): for each group, a `<section aria-labelledby>` with an h2 and a `md:grid-cols-2` grid of `ProjectCard`. Reuse `Container`. Use `Reveal` only below the first group.
4. `app/projects/page.tsx`: intro (h1, one-line description), then `ProjectDirectory`. `export const metadata = { title: "Projects", description: "…" }`. The title template yields "Projects · Adriano Matoba Lipski".
5. `site-config.ts`: `{ href: "/projects", label: "Projects", enabled: true }`.
6. `ProjectCard`: the title becomes an `AppLink` to the case study when available. Keep the separate "Case study" link for discoverability and accessible naming.

Suggested commit: `[feat.] projects directory page`

### Step 5 — MDX components

Each component is test-first, presentational and token-styled.

| Component   | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                    | Test                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CodeBlock` | Wraps the Shiki `<pre>` from MDX (`pre` mapping). The header shows the language or a `title` (from code-fence meta, if supported by `@shikijs/rehype`'s `meta` handling; otherwise a `data-title` attribute), plus a `CopyButton` copying the code's text. Scrolls horizontally **inside** the panel. Reuse the `TerminalPanel` chrome by extracting a shared `PanelFrame` if that's simpler (KISS).                                         | Copy button copies the raw code; the title renders.                      |
| `Callout`   | `kind: "note" \| "warning" \| "simulated"`. Icon plus **text label** ("Note", "Warning", "Simulated") plus children. Token borders: info/warning/neutral.                                                                                                                                                                                                                                                                                    | Label text present for each kind.                                        |
| `Figure`    | `next/image` with **required** `alt` and `caption` props → `<figure>` with `<figcaption>`. Images live in `public/case-studies/<slug>/`.                                                                                                                                                                                                                                                                                                     | Renders alt and caption; TypeScript requires both.                       |
| `Diagram`   | Props: `title`, `nodes: { id, label, x, y }[]`, `edges: { from, to, label? }[]`, `width`, `height`. Draws an SVG `role="img"` with `aria-labelledby` → title, using rounded rectangles (`fill: var(--surface)`, `stroke: var(--border)`) and arrows (`stroke: var(--muted)`, marker). Adds a **generated text alternative**: a visually hidden `<ul>` of "A → B: label" built from the edges (spec §5.7). Horizontally scrollable on mobile. | The text alternative lists every edge; the title is the accessible name. |

`mdx-components.tsx` maps `pre` → `CodeBlock`; `h2`/`h3` → styled headings (ids come from `rehype-slug`); `a` → `AppLink` (external if absolute `https`); `table`, `ul`, `ol`, `blockquote` → token-styled. It also exposes `Callout`, `Figure` and `Diagram` for use in MDX.

Suggested commit: `[feat.] MDX components for case studies`

### Step 6 — Case-study route

1. **Unit first** (`headings.test.ts`): `getHeadings(source)` → `[{ id, text }]` for `## ` lines, using `github-slugger` (the same algorithm as `rehype-slug`), skipping fenced code.
2. **Unit first:**
   - `case-study-header.test.tsx`: title as h1; description lead; status badge text; technology names; repo/demo links only when valid; "Updated <date>" only when `lastUpdated` is set.
   - `table-of-contents.test.tsx`: links in order, `href="#id"`, `nav aria-label="On this page"`.
3. **E2E first** (extend `projects.spec.ts`):
   - `/projects/tcc-engsoftware` renders the h1 and the TOC.
   - Clicking a TOC link updates the hash and scrolls to the section.
   - The back link returns to `/projects`.
   - `/projects/does-not-exist` gives 404.
   - The page title and the `og:image` URL contain the slug.
4. `app/projects/[slug]/page.tsx`:
   ```ts
   export async function generateStaticParams() { return getCaseStudySlugs().map((slug) => ({ slug })) }
   export async function generateMetadata({ params }) { /* title, description ?? summary, alternates.canonical */ }
   export default async function CaseStudyPage({ params }) {
     const { slug } = await params
     const project = getProject(slug); if (!project) notFound()
     const { default: Body } = await import(`@/content/case-studies/${project.caseStudy}.mdx`)
     const headings = getHeadings(readFileSync(...))   // server-only fs read of the same file
     ...
   }
   ```
   Layout: `Container`, back link (`← All projects`), `CaseStudyHeader`, then a grid `lg:grid-cols-[minmax(0,1fr)_14rem]` with an `<article className="prose-like">` holding `<Body />`. The TOC goes in a sticky `aside` on `lg`, and inside a `<details>` above the article on smaller screens. Reading width is about 70ch.
5. `app/projects/[slug]/opengraph-image.tsx`: the same design as the site OG image, with the project title and group. Factor the shared layout into `src/lib/og-layout.tsx` (KISS: one helper, two callers).
6. Add `src/content/case-studies/tcc-engsoftware.mdx` with a minimal Overview marked `TODO(content)` (Step 7 writes the real draft), and set `caseStudy: "tcc-engsoftware"` on the thesis.
7. **Registry test first** (`case-studies.test.ts`, uses `fs`): every `caseStudy` has `src/content/case-studies/<caseStudy>.mdx`, every `.mdx` there is referenced by a project, and at least one case study exists (the Cache Components build rule).

Suggested commit: `[feat.] case-study pages with TOC and per-project OG image`

### Step 7 — Thesis case study draft (needs network)

1. Read `https://github.com/dr1co/tcc-engsoftware` (README, structure, notebooks or scripts, requirements).
2. Draft `tcc-engsoftware.mdx` freely, following §5.2 as guidance (Overview, Problem and goals, Architecture/data pipeline, Implementation, Decisions, Validation, Limitations, Evidence). Use `Diagram` for the data/model pipeline if it helps, and code excerpts only from the public repo.
3. Write the `description` (2–3 sentences) and verify technologies, status and `lastUpdated` against the repo.
4. Mark every drafted paragraph block with `{/* TODO(content): review */}` and add an entry to `docs/prepublish-checklist.md`.
5. **No invented results.** Use only metrics stated in the repo or thesis. If none are available, say so in Limitations.
6. If the owner provides material for the DevOps project, draft its case study the same way. Otherwise it ships with a card only.

Suggested commit: `[content] draft thesis case study`

### Step 8 — Home integration

1. **E2E first:**
   - `home.spec.ts`: "View all projects" navigates to `/projects`.
   - `mobile.spec.ts`: remove the "menu hidden" test and **enable** the `fixme` menu test (open → Escape closes → link click navigates and closes).
2. `FeaturedProjects`: add a "View all projects" `AppLink` under the grid, shown when the `/projects` route is enabled.
3. Card title link (from Step 4) now applies on the home page too. Verify with a home e2e check that the thesis title opens its case study.

Suggested commit: `[feat.] link home page to projects directory`

### Step 9 — Docs and QA

1. README: status table, a "Projects and case studies" section (content model, groups, technologies, how to add a project, how to write a case study, available MDX components, Shiki theming), test-spec table rows, known limitations (no filters).
2. AGENTS.md: MDX gotchas found during implementation (Turbopack string plugins, `mdx-components.tsx` location, Shiki CSS variables, dynamic import path).
3. `docs/prepublish-checklist.md`: thesis case-study review, DevOps case study, OG images per project.
4. Manual QA at 360 / 768 / 1280 in both themes: long project titles, code blocks, diagrams, TOC sticky behaviour, reduced motion, keyboard path (back link → TOC → content).

Suggested commit: `[docs] projects feature documentation`

---

## 6. Definition of done

- [ ] Gate (§0) was met before Step 1.
- [ ] `/projects` and every `/projects/<slug>` render, prerendered at build.
- [ ] Nav shows Projects; the mobile menu works and its e2e test is enabled.
- [ ] Every link is valid or absent; no planned or placeholder projects are published.
- [ ] Case studies contain no invented claims; drafts are marked `TODO(content)`.
- [ ] `npm run check`, `npm run build` and `npm run test:e2e` pass, including axe in both themes.
- [ ] README, AGENTS.md and the checklist are updated.

## 7. Not in this plan

- Filters or search (revisit at ≥ 6 projects).
- Previous/next navigation between case studies.
- Self-hosted fonts (D4). Builds require network access to Google Fonts.
- `/lab`, `/about`, and the Phase 4 delivery work.

## 8. Risks

| Risk                                                                                                 | Mitigation                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@shikijs/rehype` options or code-fence meta titles aren't serializable or supported under Turbopack | Fall back to the language label only (no filename) and note it in AGENTS.md. As a last resort, highlight in a server component with `codeToHtml` instead of the rehype plugin. |
| The TOC ids drift from `rehype-slug` ids                                                             | Both use `github-slugger`; the e2e TOC-click test catches drift.                                                                                                               |
| Zero case studies would break the build (Cache Components)                                           | Content test requiring at least one case study (Step 6).                                                                                                                       |
| The thesis has no stated metrics or results                                                          | Limitations says so; no numbers are invented.                                                                                                                                  |
| The network is unavailable again                                                                     | The gate requires it; Steps 1 and 7 can't proceed offline.                                                                                                                     |
