# About — Implementation Plan

**Feature:** a `whoami` workflow section on the home page and the full profile page (`/about`)
**Source specs:** [features-specification.md §2.1, §3.1, §3.2, §13 Phase 2](features-specification.md), [visual-identity.md §2.5, §5.5, §10](visual-identity.md)
**Content sources:** the owner's career master document (facts) and GitHub profile README (story and tone). Nothing in the copy may go beyond what these two documents say. Both are **private**: they live outside the repo, in its parent folder (`../adriano-career-master-document.md`, `../github-readme.md`), and must never be copied into it (the master doc has contact details).
**Branch:** `feat/about`, cut from `main`. The owner makes all commits. Each step ends with a suggested commit message and a green check run.
**Status:** Planned. Decisions were settled in a grilling session on 2026-11-19. Working rules (TDD, owner commits, KISS, docs in sync) are in [AGENTS.md](../AGENTS.md).

---

## 0. Gate (check before Step 1)

- [x] `feat/about` is based on an up-to-date `main`.
- [x] `npm run check`, `npm run build` and `npm run test:e2e` are green on that base.
- [x] The network is available (builds need Google Fonts).

Gate met on 2026-11-19 (findings under Step 0).

Content the owner supplies. None of it blocks a step; each has a placeholder until it arrives:

- [ ] **Résumé PDFs**, refreshed per the master doc §12: DevOps/Automation in English and in Portuguese (A13). Until they exist, the résumé link isn't rendered.

No other content gate: Claude drafts all copy from the two source documents, marks it `// TODO(content):` and lists it in the pre-publish checklist.

---

## 1. Decisions

| #   | Topic            | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Metaphor         | A **`whoami` workflow**, not a timeline: four jobs that describe who the owner is now. In order: `whoami` → `experience` → `education` → `learning`. The stack is left to the Skills section.                                                                                                                                                                                                                                                                                                                         |
| A2  | Run states       | Each job shows a `RunStateBadge` whose state is **true**: `whoami` passed, `experience` running (current job), `education` running until the degree is awarded (expected December 2026, then passed), `learning` pending. States are static data, not derived from dates. The `education` flip is a checklist item.                                                                                                                                                                                                   |
| A3  | No spinning      | A running job here lasts years, so its icon must not spin (spec §8: no infinite decorative motion). `RunStateBadge` gets a `spin` prop (default `true`, so the Lab is unchanged); the about strip passes `false`.                                                                                                                                                                                                                                                                                                     |
| A4  | Home interaction | **Static, all visible.** A server component: every job shows its id, badge and two short lines at once. Horizontal with connectors from `md` up, a vertical list below. No tabs, no client JS. This keeps it clearly different from the tabbed delivery pipeline.                                                                                                                                                                                                                                                     |
| A5  | Home placement   | Right after the hero: Hero → **About** → Featured Projects → Pipeline → Skills → Contact. The section uses `Section` (`id="about"`, eyebrow `// whoami`). Each job links to its section on `/about` (`/about#experience`), and a "Read the full story →" link closes the section.                                                                                                                                                                                                                                     |
| A6  | `/about` layout  | **Expanded run.** The page opens with the h1, a one-paragraph lead and the **same strip** as the home (one component, one data source). Then one `h2` section per job, whose `id` is the job id, followed by the extra sections: **How I work**, **Achievements**, **Beyond the code**. It ends with the résumé link (when set) and the contact links.                                                                                                                                                                |
| A7  | Section contents | `whoami`: name, nickname "Drico", age, Ponta Grossa (Brazil), open to remote work including international, and the story from the README (UFPR → bootcamp → UEPG → DevOps). `experience`: Princesa dos Campos, March 2025 to now, highlights. `education`: B.Sc. at UEPG with a link to the thesis case study, the bootcamp. `learning`: Terraform → cloud → Kubernetes → observability.                                                                                                                              |
| A8  | Title            | `/about` shows the official title, **Systems Analyst (mid-level), automation and web systems**. The hero keeps its framing ("Software Engineer", "DevOps and Automation"). The master doc's "keep the official title visible" is met on `/about`.                                                                                                                                                                                                                                                                     |
| A9  | Age              | Computed, never typed. The repo is public, so `siteConfig.birthMonth` holds **only year and month** (`"2001-11"`), never the day. The birthday counts as reached on the **1st of the following month**: the owner's day is near the end of the month, so the age is never early and at most a few days late. A pure `ageOn(birthMonth, today)` does the arithmetic, and an `age()` helper wraps it in `'use cache'` + `cacheLife("days")`, like `currentYear()`. Prerendering stays deterministic.                    |
| A10 | Employer detail  | **Systems and numbers, no internal names.** The employer is named (it already is, in the Django template case study). Systems are described generically: a central SSO used by 10 applications, an internal audit platform (about 30% better SLA compliance time), a charter contract system (API from 5–10 s to under 2 s with indexing), Airflow integrations between the CRM, ERP and TMS. No product names (PrinceAudit, PrinceFret) and no vendors (Protheus, Brudam, Vestro).                                   |
| A11 | Extra sections   | **How I work**: TDD, trade-offs over complexity (the indexing-not-caching story), ownership including documentation, understanding the business problem. **Achievements**: Copel Hackathon 2023 (5th of 50 teams, final pitch), OBA gold 2018 and bronze 2017, Kangaroo bronze 2017 and 2018, Brazilian Rubik's Cube Championship bronze 2019. **Beyond the code**: languages (PT native, EN fluent, ES and DE intermediate, HU basic), speedcubing with the WCA profile link, piano since age 6 and jazz production. |
| A12 | Photo            | None.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| A13 | Résumé           | One **DevOps/Automation** résumé per locale: English on `/about`, Portuguese on `/pt-br/about`. Files live in `public/resume/`. `siteConfig.resume` is a `Localized` path; an empty value hides the link. A test fails if a configured path has no file. This creates `public/`, so the Dockerfile gets `COPY --from=build /app/public ./public` (`.dockerignore` already allows it).                                                                                                                                 |
| A14 | Voice            | First person, plain and direct, no em dashes (master doc §12). Same tone as the README and the Django case study.                                                                                                                                                                                                                                                                                                                                                                                                     |
| A15 | Content format   | **Typed data** in `src/content/about.ts` (`Localized` fields, `getAbout(locale)`), not MDX. The page is mostly lists and short paragraphs, the strip needs structured data anyway, and `translations.test.ts` then covers the Portuguese text automatically.                                                                                                                                                                                                                                                          |
| A16 | Anchors          | Section ids are the job ids and fixed English keys (`#whoami`, `#how-i-work`), the same in both languages. That avoids the case-study problem of translated heading ids, so home links work in both locales.                                                                                                                                                                                                                                                                                                          |
| A17 | Navigation       | Enable `/about` in `siteConfig.routes`. That also adds it to the mobile menu and the sitemap (`getEnabledRoutes`). The page sets `alternates: canonicalFor("/about", locale)`. No proxy change (static route).                                                                                                                                                                                                                                                                                                        |
| A18 | SEO              | Unique `title` and `description` per locale. The page reuses the site OG image (same as L17 in the Lab plan).                                                                                                                                                                                                                                                                                                                                                                                                         |
| A19 | Data fixes       | In `src/content/skills.ts`: remove **Redis** (the master doc says not experienced), and reorder **Learning Next** to match the README path: Terraform → AWS → Kubernetes → Grafana (observability). Grafana is new in `technologies.ts`. AWS stays in the learning group (owner's choice).                                                                                                                                                                                                                            |
| A20 | Copy             | Claude drafts everything from the two source documents, in English and Portuguese, marks it `// TODO(content):` and lists it in `docs/prepublish-checklist.md`.                                                                                                                                                                                                                                                                                                                                                       |
| A21 | Test seams       | Agreed: `ageOn` (unit), content rules (unit), components (unit), routes and home integration (e2e). Details in §4.                                                                                                                                                                                                                                                                                                                                                                                                    |

---

## 2. Model (guidance, not final code)

```ts
// src/lib/site-config.ts (additions)
type SiteConfigEntry = {
  // ...
  nickname: string; // "Drico"
  birthMonth: string; // "YYYY-MM", never the day (A9)
  location: Localized; // "Ponta Grossa, Brazil"
  resume: Localized; // "/resume/adriano-lipski-devops-en.pdf", or "" to hide
};

// src/content/about.ts
type AboutJobEntry = {
  id: "whoami" | "experience" | "education" | "learning";
  state: RunState; // from lab-pipeline.ts; A2
  summary: readonly Localized[]; // the two lines on the strip
};

type AboutEntry = {
  lead: Localized;
  jobs: readonly AboutJobEntry[];
  story: readonly Localized[]; // whoami paragraphs
  experience: {
    company: string;
    title: Localized; // official title, A8
    period: Localized;
    highlights: readonly Localized[];
  };
  education: readonly {
    institution: string;
    degree: Localized;
    period: Localized;
    note?: Localized;
    href?: string; // e.g. "/projects/tcc-engsoftware"
  }[];
  learning: readonly { tech: TechnologyId; note: Localized }[];
  principles: readonly { title: Localized; body: Localized }[];
  achievements: readonly { year: number; title: Localized }[];
  languages: readonly { name: Localized; level: Localized }[];
  facts: readonly { body: Localized; href?: string }[]; // WCA link
};

export function getAbout(locale: Locale): Resolved<AboutEntry>;
```

The age and "open to remote work" are composed into the whoami text through messages with interpolation (`t.about.whoami(age, location)`), so the number never sits inside a translated string.

---

## 3. Target file tree (additions and changes)

```text
public/
  resume/                                    NEW  owner-supplied PDFs (Step 7)
src/
  app/[lang]/about/page.tsx                  NEW  metadata, canonical, sections
  content/
    about.ts                                 NEW  jobs, story, experience, … (TODO(content))
    about.test.ts                            NEW  content rules
    skills.ts                                CHG  Redis out, learning order (A19)
    technologies.ts                          CHG  grafana
  lib/
    age.ts (+ .test.ts)                      NEW  ageOn (pure) + age() (cached)
    site-config.ts                           CHG  nickname, birthMonth, location, resume; /about enabled
    resume.test.ts                           NEW  node env; configured résumé files exist
  i18n/messages/en.ts, pt-br.ts              CHG  about.* labels and sentences
  components/
    about/about-pipeline.tsx (+ .test)       NEW  server; the job strip, links to anchors
    about/about-section.tsx (+ .test)        NEW  home section: strip + "Read the full story"
    lab/run-state-badge.tsx (+ .test)        CHG  spin prop (A3)
  app/[lang]/page.tsx                        CHG  AboutSection after Hero
e2e/
  about.spec.ts                              NEW
  home.spec.ts, mobile.spec.ts               CHG  section order, About nav item
  smoke.spec.ts                              CHG  @smoke: /about renders, canonical
Dockerfile                                   CHG  COPY public (Step 7)
```

---

## 4. Test seams (agreed)

| Seam             | Level       | Behaviours                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Age              | unit        | `ageOn` on the last day of the birth month (not yet), on the 1st of the next month (one more), and a December birth month (rolls over on 1 January).                                                                                                                                                                                |
| Content          | unit        | Job ids are unique and in A1 order; every job has a state and at least one summary line; every education `href` is a valid internal path; external links (WCA) pass `links.ts`; `translations.test.ts` covers the Portuguese text.                                                                                                  |
| Résumé           | unit (node) | Every non-empty `siteConfig.resume` path points to a file in `public/`.                                                                                                                                                                                                                                                             |
| Components       | unit        | `AboutPipeline` lists the four jobs in order, each with its state as text and a link to `/about#<id>`; the running badge has no spin class when `spin={false}`; `AboutSection` links to `/about`; the résumé link is absent when the path is empty.                                                                                 |
| Routes           | e2e         | `/about` has one h1, an h2 per job and per extra section; nav marks About `aria-current="page"`; a job link from the home lands on its section (`#experience` in view) in both locales; the thesis link opens its case study; axe in both themes (after `revealAllSections`); no horizontal overflow at 360px; title and canonical. |
| Home integration | e2e         | The about section sits between the hero and featured projects; the mobile menu lists About.                                                                                                                                                                                                                                         |

---

## 5. Implementation steps

Work test-first in vertical slices, per AGENTS.md. Each step must pass `npm run check`. Steps that touch routes must also pass `npm run build` and `npm run test:e2e`.

### Step 0 — Gate and baseline

1. Verify §0. Stop if it's unmet.
2. Read `node_modules/next/dist/docs/` for anything new on static routes, `'use cache'`/`cacheLife` and serving files from `public/`. Note findings here if they change a step.

No commit.

**Findings (2026-11-19):**

- The branch was one commit (this plan) ahead of an up-to-date `main`. `npm run build` and `npm run test:e2e` (163 passed, 15 skipped) were green. `npm run check` failed only because Prettier checked the private source documents while they still sat in `docs/`. Prettier reads `.gitignore` and `.prettierignore`, not `.git/info/exclude`. Moving them out of the repo fixed it without listing their names in a public ignore file.
- Files in `public/` are served from `/` with `Cache-Control: public, max-age=0`. That's fine for the résumé PDFs (Step 7).
- The `days` cache profile revalidates daily (stale 5 min, expire 1 week), so `age()` is correct within a day, the same as `currentYear()`.
- `ensureStatic` (a new segment config) could require `/about` to stay fully static. Not adopted: the build already prerenders it, and nothing in the plan needs the extra guarantee.

### Step 1 — Skills data fixes (A19)

1. **Test first**, where a rule is worth keeping: none is (it's content). Just make the change.
2. `skills.ts`: remove `redis` from Databases; Learning Next becomes `terraform`, `aws`, `kubernetes`, `grafana`.
3. `technologies.ts`: add `grafana` (Simple Icons has it). `tech-icons` tests cover its contrast fallback.
4. Update any e2e expectation that counts skills.

Suggested commit: `[fix.] align skills with the career doc`

**Done.** Notes from implementing:

- `redis` stays in `technologies.ts`: it's the vocabulary, not a claim, and `skills-section.test.tsx` uses it as a fixture. Only the skill entry is gone.
- Grafana's orange is below 3:1 on the light tile, so it falls back to `--foreground` there and keeps its brand colour in dark (the existing `techIcon` rule; no new code).
- No e2e expectation depended on the changed skills. The full e2e run hit three Lab playback failures (`lab.spec.ts`: Run clicked before hydration, status never changed). They passed 25/25 when repeated alone, so they're a load-dependent race, not a regression. Those tests call `goto` then click without `waitForHydration`.

### Step 2 — Age

1. **Tests first** (`age.test.ts`): the §4 cases, one at a time.
2. `src/lib/age.ts`: `ageOn(birthMonth: string, today: Date): number`, and `age(birthMonth)` with `'use cache'` + `cacheLife("days")`.
3. `site-config.ts`: add `nickname`, `birthMonth: "2001-11"`, `location`.

Suggested commit: `[feat.] age computed from the birth month`

**Done.** Notes from implementing:

- `age.test.ts` also checks that `siteConfig.birthMonth` matches `YYYY-MM`, so a full date (with the day) fails the suite. The privacy rule from A9 is enforced, not just documented.
- `ageOn` reads local date parts, like `currentYear()`. Servers run in UTC, so around midnight on the 1st the age can turn a few hours early or late. That's within the rule's stated precision.
- Nothing renders the age yet (Step 3 composes it into the whoami text), so build and e2e are unaffected by this step.

### Step 3 — About content

1. **Content test first** (`about.test.ts`), then `src/content/about.ts`.
2. Draft every field in English and Portuguese from the source documents (A7, A10, A11, A14). Mark it `// TODO(content):`.
3. Add an "About copy" entry to `docs/prepublish-checklist.md`, plus "flip `education` to passed after graduation" (A2).

Suggested commit: `[feat.] about page content`

**Done.** Amended while implementing:

- `translations.test.ts` lists its content modules explicitly, so `about` was added there (it isn't automatic, as A15 assumed). "Driven Education" joined its `SAME_IN_BOTH` allowlist.
- `experience` gained a `context` line (what the company is), and `institution` is `Localized` (the university's name is translated).
- `about.test.ts` also checks that `learning` lists the same technologies, in the same order, as the skills section's learning group, so the home page and `/about` can't drift apart. Achievements must be newest first.
- The whoami summary has no age or location: Step 4 composes that line from `siteConfig` and a message, so the number never sits inside translated content.

### Step 4 — Job strip

1. **Test first** (`run-state-badge.test.tsx`): `spin={false}` renders the running icon without the spin class.
2. **Test first** (`about-pipeline.test.tsx`), then `AboutPipeline` (server, takes `locale`): numbered jobs with id in mono, badge, summary lines, connectors (decorative, `aria-hidden`), each job a link to `/about#<id>`. An ordered list, so screen readers hear "1 of 4". Same visual language as the pipeline preview nodes (§5.5), but no selection state.

Suggested commit: `[feat.] whoami job strip`

### Step 5 — `/about` page

1. **E2E first** (`e2e/about.spec.ts`): h1, the strip, h2 per section, nav `aria-current`.
2. `app/[lang]/about/page.tsx`: the same header pattern as `/projects` and `/lab` (`// about` eyebrow, h1, lead), the strip, then the sections (A6, A7, A11) with `id`s per A16 and `scroll-mt` so the sticky header doesn't cover them. The page component stays synchronous where it reads params (instant-navigation gotcha). `generateMetadata` with title, description and `canonicalFor("/about", locale)`.
3. Contact links at the end through `getContactLinks`.
4. `site-config.ts`: enable `/about`. Check the header at mobile width (four nav items).
5. Add `/about` to the `@smoke` canonical test.
6. Check `next dev -p 3300` for `instant-shell-url-data` warnings, directly and via client navigation.

Suggested commit: `[feat.] about page`

### Step 6 — Home integration

1. **E2E first** (`home.spec.ts`): the about section follows the hero; a job link lands on its `/about` section, also under `/pt-br`.
2. **Unit first** (`about-section.test.tsx`), then `AboutSection` and its place in `app/[lang]/page.tsx` (A5).
3. Update `mobile.spec.ts` if the layout assertions depend on section order.

Suggested commit: `[feat.] whoami section on the home page`

### Step 7 — Résumé

1. **Test first** (`resume.test.ts`, node env) and a component test that an empty path renders no link.
2. `siteConfig.resume` (empty in both locales until the PDFs arrive), the link on `/about` as an `AppLink` with `external` (opens the PDF in a new tab; see §8 on locale prefixes).
3. Once a PDF exists: `public/resume/`, `COPY --from=build /app/public ./public` in the Dockerfile runtime stage, and remove the matching AGENTS.md gotcha line ("The runtime stage doesn't copy `public/`…"). Run `npm run docker:smoke` on a network that allows it, or ask the owner for the CI result.

Suggested commit: `[feat.] résumé download on the about page`

### Step 8 — Docs and QA

1. `README.md`: the about page, where its content lives, how the age is computed, where résumé files go.
2. `AGENTS.md`: anchors are fixed English ids (A16); `spin={false}` for long-lived running states; `public/` now exists.
3. `features-specification.md` needs no change. Mark this plan done and add it to the AGENTS.md list of plans.
4. QA on a production build, both themes: widths 360 to 1920, keyboard only (skip link → hero → about jobs → …), reduced motion (no spinning anywhere on the strip), JavaScript disabled (the whole page reads), axe, Lighthouse on `/about`.

Suggested commit: `[docs.] about page docs and QA`

---

## 6. Definition of done

- [ ] `/about` renders in both locales, is prerendered at build, and is in the nav, the mobile menu and the sitemap.
- [ ] The home about section sits after the hero; every job links to its `/about` section in both locales.
- [ ] Every run state is true, shown as icon + text, and nothing on the strip moves on its own.
- [ ] The age comes from `birthMonth`, never fails prerendering, and no birth day appears anywhere in the repo.
- [ ] No internal product names or vendors from the employer appear (A10).
- [ ] The résumé link appears only when its file exists.
- [ ] `npm run check`, `npm run build` and `npm run test:e2e` pass, including axe in both themes.
- [ ] README, AGENTS.md and the checklist are updated; drafted copy is marked `TODO(content)`.

## 7. Not in this plan

- A photo (A12).
- Full-Stack and ML résumé variants (A13).
- A dedicated `/contact` page (spec §3.1).
- Moving AWS out of Learning Next (owner kept it there).
- Run states derived from dates (A2): `education` is flipped by hand.
- A per-page OG image (A18).

## 8. Risks

| Risk                                                                  | Mitigation                                                                                                                                               |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two pipeline visuals on the home page blur together                   | The about strip is static, has no tabs or terminal panel, and sits far from the delivery pipeline (Projects between them). Review both in the Step 8 QA. |
| A "running" badge reads as a live system claim                        | The context makes it a metaphor (job: `experience`, line: "March 2025 to now"). No "live" or "deployed" wording anywhere.                                |
| `AppLink` prefixes internal paths with the locale (`/pt-br/resume/…`) | The résumé link is `external`, so its path is used as is. The proxy matcher already skips paths with a file extension. Check both locales in e2e.        |
| A birth day leaks into the public repo                                | Only year and month are stored (A9). Tests use made-up dates, never the owner's.                                                                         |
| `education` stays "running" after graduation                          | A checklist item, dated December 2026.                                                                                                                   |
| Drafted copy overstates something                                     | Every claim maps to a ✅ line in the master doc; the checklist entry asks the owner to review each field next to its source.                             |
| Anchored sections hide under the sticky header                        | `scroll-mt` on each section; the e2e test checks the target heading is in view.                                                                          |
| Content inside `Section` starts at `opacity: 0` (`Reveal`)            | Unit tests assert `toBeInTheDocument()`; e2e scrolls sections into view before axe (`revealAllSections`).                                                |
