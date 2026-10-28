# Lab — Implementation Plan

**Feature:** Technical laboratory (`/lab`) and the Pipeline Explorer (`/lab/pipeline`)
**Source specs:** [features-specification.md §6.1–6.2, §13 Phase 3](features-specification.md), [visual-identity.md §2.5, §5.5, §6](visual-identity.md)
**Branch:** `feat/lab`, cut from `main`. The owner makes all commits. Each step ends with a suggested commit message and a green check run.
**Status:** Not started. Decisions were settled in a grilling session on 2026-10-28. Working rules (TDD, owner commits, KISS, docs in sync) are in [AGENTS.md](../AGENTS.md).

---

## 0. Gate (check before Step 1)

- [x] `feat/lab` exists and is based on an up-to-date `main`.
- [x] `npm run check`, `npm run build` and `npm run test:e2e` are green on that base.
- [x] The network is available (`npm i -D yaml` in Step 2, and builds need Google Fonts).

Gate met on 2026-10-28.

No content gate: Claude drafts all Lab copy from `ci.yml`, marks it `TODO(content)` and lists it in the pre-publish checklist (L16).

---

## 1. Decisions

| #   | Topic            | Decision                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| L1  | Scope            | The `/lab` landing page and the Pipeline Explorer only. Container Explorer and Observability stay in Phase 5 and get **no** teaser or "planned" cards (same rule as D13 in the projects plan). `/about` gets its own plan.                                                                                                                                                                             |
| L2  | Routes           | `/lab` is a landing page with demo cards. Each demo gets its own **static** route; the first is `/lab/pipeline`. No dynamic `[demo]` route, so `src/proxy.ts` is untouched.                                                                                                                                                                                                                            |
| L3  | What it models   | **This portfolio's real CI** (`.github/workflows/ci.yml`). Execution is simulated, but the jobs, `needs`, conditions, step names and excerpts are real. Links point to the workflow file and its Actions runs on GitHub.                                                                                                                                                                               |
| L4  | Graph shape      | **Job-level DAG**: a `Trigger` pseudo-node plus one node per job (`quality`, `e2e`, `image`, `publish`, `deploy-preview`, `deploy-production`). On desktop it's laid out in columns by dependency level, and every node shows its `needs`. On mobile it's a vertical list in topological order. Prev/Next follows topological order.                                                                   |
| L5  | Scenarios        | Four deterministic scenarios: **Push to main**, **Pull request** (same-repo PR), **Failure on main** (`e2e` fails), **Vulnerable image** (Trivy gate fails in `image`, on main). Outcomes are **derived** from the job model (event conditions + `needs`), not hand-written per scenario. A scenario only declares its event and which step fails, if any.                                             |
| L6  | Playback         | **Run** resets every job to pending, then advances on a fixed tick. Jobs at the same dependency level run together (`running` → outcome). The selection follows the running level, but **focus never moves**. **Pause**, **Resume** and **Reset** are available. Prev/Next or a node click stops playback. No autoplay.                                                                                |
| L7  | Reduced motion   | With `prefers-reduced-motion`, Run jumps straight to the final states. The running icon doesn't spin. Motion's `MotionConfig reducedMotion="user"` already covers layout transitions.                                                                                                                                                                                                                  |
| L8  | Initial state    | The **Push to main** scenario with its final outcomes shown, and `Trigger` selected. It's readable without pressing anything. Run replays it.                                                                                                                                                                                                                                                          |
| L9  | No-JS fallback   | A `<noscript>` **outcome matrix**: jobs × scenarios, each cell with the outcome as text.                                                                                                                                                                                                                                                                                                               |
| L10 | Scenario picker  | An accessible **radio group** (segmented look). Switching scenario stops playback, shows the new scenario's final states and selects `Trigger`.                                                                                                                                                                                                                                                        |
| L11 | Job panel        | Purpose, explanation, run state + the scenario's reason (e.g. "Skipped: needs `e2e`, which failed"), `needs` and the condition in plain words, a **step checklist** (step states derive from the job), and a collapsible **real YAML excerpt** in a `TerminalPanel` titled `.github/workflows/ci.yml`.                                                                                                 |
| L12 | Failed color     | The existing `--error` token (already AA-tested in both themes) through a new `error` `Badge` tone. Passed uses `accent`, which is the success green. Every state is icon + text, never color alone.                                                                                                                                                                                                   |
| L13 | Drift            | Hand-written data in `src/content/lab-pipeline.ts`, plus a **Vitest drift test** that parses `ci.yml` (`yaml` dev dependency). The test asserts job ids, `needs`, event conditions and step names match, and that every excerpt line appears verbatim in the file. Excerpts **must not** contain pinned refs (`@<40-hex>`, `@sha256:`): they change with every Dependabot bump. The test rejects them. |
| L14 | Home integration | Keep the generic home preview. Add an "Explore the real pipeline in the Lab →" link under it, and enable **Lab** in the nav. Hero buttons stay unchanged.                                                                                                                                                                                                                                              |
| L15 | URL state        | None. Scenario, selection and playback live in client state only.                                                                                                                                                                                                                                                                                                                                      |
| L16 | Copy             | Claude drafts all copy from `ci.yml` and the repo. It's marked `// TODO(content):` and listed in `docs/prepublish-checklist.md`.                                                                                                                                                                                                                                                                       |
| L17 | SEO              | A unique `title`, `description` and canonical for `/lab` and `/lab/pipeline`. They reuse the site OG image, with no per-page generator.                                                                                                                                                                                                                                                                |
| L18 | Not modeled      | GitHub's `cancelled` state (concurrency), fork PRs, the SARIF upload's `continue-on-error`, and real run durations. The Explorer's intro says it's a simplified model.                                                                                                                                                                                                                                 |
| L19 | Honesty          | A "Simulated" badge on the landing card, the page header and the Explorer panel. The intro says: "Outcomes are scripted from the real workflow. Nothing here triggers GitHub Actions." A passed deploy never reads as "deployed" or "live" without "(simulated)".                                                                                                                                      |
| L20 | Test seams       | Agreed: the simulation model (unit, pure functions + fake timers), the drift test (unit, node env), components (unit), and routes + home integration (e2e). Details in §4.                                                                                                                                                                                                                             |

---

## 2. Model (guidance, not final code)

```ts
// src/content/lab-pipeline.ts
export type PipelineEvent = "push-main" | "pull-request";
export type RunState = "pending" | "running" | "passed" | "failed" | "skipped";

export type CiStep = {
  name: string;
  onFailure?: true;
  events?: readonly PipelineEvent[];
};
export type CiJob = {
  id:
    | "quality"
    | "e2e"
    | "image"
    | "publish"
    | "deploy-preview"
    | "deploy-production";
  label: string;
  icon: LabIcon; // string key → Lucide on the client (serializable)
  needs: readonly CiJob["id"][];
  events: readonly PipelineEvent[]; // the job's `if:` in model form
  purpose: string;
  explanation: string;
  steps: readonly CiStep[]; // names match ci.yml
  excerpt: readonly string[]; // verbatim ci.yml lines, no pinned refs
};

export type Scenario = {
  id: "push-main" | "pull-request" | "failure-main" | "vulnerable-image";
  label: string;
  summary: string;
  event: PipelineEvent;
  failure?: { job: CiJob["id"]; step: string; reason: string };
};
```

```ts
// src/lib/pipeline-run.ts — pure, no React
resolveRun(jobs, scenario); // → Record<jobId, { state: "passed"|"failed"|"skipped"; reason: string; steps: RunState[] }>
dependencyLevels(jobs); // → jobId[][] (level 0 = jobs with no needs); Trigger is drawn before level 0
topologicalOrder(jobs); // → jobId[] for tabs and Prev/Next
runFrames(jobs, outcome); // → Record<jobId, RunState>[] for playback: all pending, then per level
//   running → outcome; skipped jobs never run; an all-skipped level takes one frame
```

Rules for `resolveRun`:

- A job is **skipped** if its `events` exclude the scenario's event ("runs only on push to main") or if any job in `needs` failed or was skipped ("needs `e2e`, which failed").
- The job named in `failure` **fails** at that step. Earlier steps pass, later steps are skipped unless `onFailure` is set (e.g. "Upload Playwright report").
- A step whose `events` exclude the event is skipped (e.g. "Keep the tested image for publishing" on a PR).
- Otherwise the job **passes**.

Expected outcomes (asserted in tests):

| Job               | Push to main | Pull request        | Failure on main         | Vulnerable image        |
| ----------------- | ------------ | ------------------- | ----------------------- | ----------------------- |
| quality           | passed       | passed              | passed                  | passed                  |
| e2e               | passed       | passed              | **failed**              | passed                  |
| image             | passed       | passed              | passed                  | **failed** (Trivy gate) |
| publish           | passed       | skipped (main only) | skipped (needs e2e)     | skipped (needs image)   |
| deploy-preview    | skipped (PR) | passed              | skipped (PR)            | skipped (PR)            |
| deploy-production | passed       | skipped (main only) | skipped (needs publish) | skipped (needs publish) |

---

## 3. Target file tree (additions and changes)

```text
src/
  app/
    lab/page.tsx                         NEW  landing: intro + demo cards
    lab/pipeline/page.tsx                NEW  Explorer page, metadata, noscript matrix
  content/
    lab.ts                               NEW  demo cards (objective, concepts, mode, prerequisites, links)
    lab.test.ts                          NEW  content rules
    lab-pipeline.ts                      NEW  jobs, steps, excerpts, scenarios (TODO(content))
    lab-pipeline.drift.test.ts           NEW  node env; parses .github/workflows/ci.yml
  lib/
    pipeline-run.ts (+ .test.ts)         NEW  pure simulation model
    use-pipeline-playback.ts (+ .test)   NEW  reducer + timer hook
    use-roving-tabs.ts                   CHG  optional controlled mode (selected/onSelect)
    site-config.ts                       CHG  routes./lab.enabled = true
  components/
    ui/badge.tsx                         CHG  error tone
    lab/lab-card.tsx (+ .test)           NEW
    lab/run-state-badge.tsx (+ .test)    NEW  state → icon + text + tone
    lab/pipeline-explorer.tsx (+ .test)  NEW  client island: picker, graph, controls, panel, live region
    lab/job-node.tsx                     NEW
    lab/job-panel.tsx (+ .test)          NEW
    lab/scenario-picker.tsx              NEW  radio group
    lab/outcome-matrix.tsx (+ .test)     NEW  server; used in <noscript> (and optionally in a <details>)
    home/pipeline-section.tsx            CHG  link to /lab/pipeline
e2e/
  lab.spec.ts                            NEW
  home.spec.ts, mobile.spec.ts           CHG  Lab link, nav item, mobile Explorer layout
  smoke.spec.ts                          CHG  @smoke: /lab and /lab/pipeline render
package.json                             CHG  yaml (devDependency)
```

---

## 4. Test seams (agreed)

| Seam             | Level       | Behaviours                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Simulation model | unit        | `resolveRun` produces the §2 matrix, including reasons; step states follow the failure and `onFailure`/`events` rules; `dependencyLevels` and `topologicalOrder` match `needs`; `runFrames` goes pending → running → outcome level by level, ends on the resolved outcome, and skipped jobs never show running.                                                                                                              |
| Playback         | unit        | Reducer: `run` resets to tick 0, `tick` advances until done, `pause`/`resume`, `reset`, `select`/`next`/`prev` stop playback, `setScenario` stops and shows final states. The hook with fake timers: a run finishes after the expected number of ticks; reduced motion finishes immediately; unmounting or hiding clears the timer.                                                                                          |
| Drift            | unit (node) | Every modeled job exists in `ci.yml` and vice versa; `needs` are equal; the `events` model matches each job's `if:`; step names exist in order; excerpt lines appear verbatim; no excerpt contains a pinned ref.                                                                                                                                                                                                             |
| Content          | unit        | Every demo card has an objective, at least one concept, a mode and a valid internal `href`; external links pass `links.ts`; every scenario's `failure` names a real job and step.                                                                                                                                                                                                                                            |
| Components       | unit        | `RunStateBadge` shows text for every state; the Explorer renders tabs in topological order, the picker switches scenario and resets the selection, Prev/Next move selection and are disabled at the ends, Run/Pause/Reset update the live region, the panel shows the reason, step checklist and excerpt; `OutcomeMatrix` lists every job × scenario as text; `LabCard` shows the "Simulated" badge.                         |
| Routes           | e2e         | `/lab` lists the Pipeline Explorer card and navigates to `/lab/pipeline`; nav marks Lab `aria-current="page"` on `/lab` and `"true"` on `/lab/pipeline`; keyboard-only: picker → tabs (arrows, Home/End) → Prev/Next → Run; a run finishes (`page.clock`) with the expected outcomes; reduced motion (`emulateMedia`) gives final states at once; axe in both themes; no horizontal overflow at 360px; titles and canonical. |
| Home integration | e2e         | The pipeline section's Lab link goes to `/lab/pipeline`; the mobile menu lists Lab.                                                                                                                                                                                                                                                                                                                                          |

---

## 5. Implementation steps

Work test-first in vertical slices, per AGENTS.md. Each step must pass `npm run check`. Steps that touch routes must also pass `npm run build` and `npm run test:e2e`.

### Step 0 — Gate and baseline

1. Verify §0. Stop if it's unmet.
2. Read `node_modules/next/dist/docs/` for anything new on static routes and metadata since the projects plan. Note findings in §7 if they change a step.

No commit.

**Findings (2026-10-28):**

- Metadata is merged **shallowly** across segments (`generate-metadata.md`, "Merging"). The root layout sets `alternates: { canonical: "/" }` when `NEXT_PUBLIC_SITE_URL` is set, so any page that doesn't set `alternates` itself inherits canonical `/`. Fixed before Step 1: the layout no longer sets a canonical, each page calls `canonicalFor(path)` from `src/lib/canonical.ts`, and a `@smoke` test checks it. Both Lab pages must use `canonicalFor` too (Steps 4 and 5), and Step 7 adds them to that smoke test.
- Activity (`preserving-ui-state.md`) confirms the plan: hidden routes keep their state, and a `useLayoutEffect` cleanup is the documented way to reset transient state. Playback must pause there (Step 6), or it would resume on its own when the route is shown again.
- Static routes need nothing new: `/lab` and `/lab/pipeline` are plain `page.tsx` files, so the proxy and `generateStaticParams` aren't involved.

### Step 1 — Error tone and state badge (done)

Amended while implementing: `--error` already existed in both themes and was already in the AA test, so no new token. `accent` is the same green as `--success`, so no `success` tone either.

1. `Badge`: add an `error` tone.
2. **Test first** (`run-state-badge.test.tsx`): each `RunState` renders its text label ("Pending", "Running", "Passed", "Failed", "Skipped"), and the icon is decorative. Icons: `Clock`, `LoaderCircle` (`motion-safe:animate-spin`), `CircleCheck`, `CircleX`, `CircleSlash`. Tones: neutral, info, accent, error, neutral.
3. `RunState` lives in `src/content/lab-pipeline.ts`; Step 2 adds the rest of the model there.

Suggested commit: `[feat.] error badge tone and run-state badge`

### Step 2 — Pipeline content and drift test

1. `npm i -D yaml`.
2. **Drift test first** (`lab-pipeline.drift.test.ts`, `// @vitest-environment node`), one assertion group at a time (§4), then write `lab-pipeline.ts` to pass it. Map `if:` expressions to `events` with a small table in the test (e.g. `github.event_name == 'push' && github.ref == 'refs/heads/main'` → `["push-main"]`). An unknown expression fails the test with a message that says to update the model.
3. Draft `purpose`, `explanation` and `excerpt` for each job, plus the four scenarios. Mark them `// TODO(content):`. Excerpts show the interesting lines (`needs`, `if`, `permissions`, the gating `run:`). Skip `uses:` lines with SHAs.
4. Add a "Lab pipeline copy" entry to `docs/prepublish-checklist.md`.

**Acceptance:** changing a job's `needs` in `ci.yml` makes the drift test fail.
Suggested commit: `[feat.] Lab pipeline model of ci.yml with drift test`

**Done.** Notes from implementing:

- The model lists **every** step of each job, in order, so adding a step to `ci.yml` also fails the test. Unnamed steps are named the way GitHub shows them: the action without its `@ref` (`actions/checkout`), or the command (`docker load -i image.tar`).
- Step conditions use the same mapping table as job conditions (`failure()` → `onFailure`, `env.IS_MAIN_PUSH == 'true'` → `["push-main"]`). The SARIF upload's same-repo condition maps to "always" because fork PRs aren't modeled (L18).
- Excerpt lines are compared **trimmed**, so excerpts can be re-indented. A `# …` line marks omitted lines and is exempt.
- The scenario rule ("failure names a real job and step") lives in `src/content/lab-pipeline.test.ts`, next to the scenarios, instead of Step 4's `lab.test.ts`.
- Mutation-checked: changing a `needs`, renaming a step, or adding an unknown `if:` each fail the test.

### Step 3 — Simulation model

1. **Tests first** (`pipeline-run.test.ts`): one slice at a time — `topologicalOrder`, `dependencyLevels`, `resolveRun` for each scenario (the §2 matrix and reasons), step states, then `runFrames`.
2. Implement `src/lib/pipeline-run.ts` as pure functions over the content types.

Suggested commit: `[feat.] deterministic pipeline run model`

**Done.** Amended while implementing: `statesAtTick(jobs, outcome, tick)` became `runFrames(jobs, outcome)`, which returns the whole timeline. The playback reducer (Step 6) only needs a frame index, and "done" is the last index. A level where every job is skipped takes one frame instead of an empty running frame. The event wording in reasons ("Runs only on pull requests.") comes from `eventLabels` in `src/content/lab-pipeline.ts`.

### Step 4 — `/lab` landing page

1. **E2E first** (`e2e/lab.spec.ts`): `/lab` has an h1 "Lab", a card for the Pipeline Explorer with a "Simulated" label, and the nav item Lab with `aria-current="page"`.
2. **Unit first**: `lab.test.ts` (content rules) and `lab-card.test.tsx`.
3. `src/content/lab.ts`: `labIntro` and `labDemos` (`slug`, `title`, `summary`, `objective`, `concepts`, `mode: "simulated" | "live"`, `prerequisites?`, `href`, `sourceUrl?`, `relatedProject?`). `sourceUrl` is the `ci.yml` blob URL built from `siteConfig.sourceRepoUrl`.
4. `LabCard` (server): title link, summary, objective, concept badges, mode badge, prerequisites (only when set), source link through `links.ts`.
5. `app/lab/page.tsx`: the same header pattern as `/projects` (`// lab` eyebrow, h1, intro), then the cards. `metadata` with title, description and canonical.
6. `site-config.ts`: enable `/lab`. Check the header at mobile width (the menu now has three items).

Suggested commit: `[feat.] Lab landing page`

### Step 5 — Explorer, static interaction

No playback yet: scenario picker, graph, selection, Prev/Next, panel.

1. `useRovingTabs`: add an optional controlled mode (`{ selected, onSelect }`). **Test first** that existing uncontrolled behavior is unchanged and that controlled mode calls `onSelect`.
2. **Component tests first** (`pipeline-explorer.test.tsx`, `job-panel.test.tsx`): the §4 component behaviours, except playback.
3. `PipelineExplorer` (`'use client'`, props are the serializable content; icons by string key):
   - Header: "Simulated" badge and the honesty line (L19), a link to the real workflow runs.
   - `ScenarioPicker`: `role="radiogroup"` with native radio inputs styled as a segmented control, arrow-key behavior from the browser.
   - Graph: `role="tablist"` (`aria-orientation` follows the layout). `Trigger` first, then jobs in topological order. Desktop: CSS grid with one column per dependency level, `aria-hidden` connectors between columns, and "needs: …" text on each node. Mobile: a vertical list. Each node: icon, label, `RunStateBadge`, selection = accent border (visual-identity §5.5).
   - Prev/Next buttons with accessible names ("Previous job", "Next job"), disabled at the ends.
   - `JobPanel` in `role="tabpanel"`: L11 content. The excerpt sits in a `<details>` with a `TerminalPanel`, like the home preview. `Trigger` shows the event and the `on:` excerpt.
4. `app/lab/pipeline/page.tsx`: back link "← Lab", h1 "Pipeline Explorer", intro + L18 scope note, the Explorer, and `<noscript><OutcomeMatrix/></noscript>`. Wrap the matrix table in `ScrollArea`. `metadata` with title, description and canonical.
5. **E2E first** for the route parts: navigation from `/lab`, keyboard path (picker → tabs → Prev/Next), the scenario switch changes outcomes, axe in both themes, no overflow at 360px.

Suggested commit: `[feat.] Pipeline Explorer with scenarios`

### Step 6 — Run playback

1. **Reducer tests first** (`use-pipeline-playback.test.ts`): the §4 playback behaviours. Then the hook with `vi.useFakeTimers()`.
2. `usePipelinePlayback(jobs, scenario)`: reducer + `setInterval` in an effect. `TICK_MS` is one constant (start at 800 ms). Reduced motion comes from Motion's `useReducedMotion()`: Run dispatches straight to done.
3. Under Cache Components, the page stays mounted under `<Activity mode="hidden">` after navigating away. Stop playback in a `useLayoutEffect` cleanup (AGENTS.md gotcha). No `Date.now()` during render.
4. Controls: Run (becomes Pause/Resume while running), Reset. A polite `role="status"` line announces level changes ("Running: quality, e2e, image") and the end of a run ("Run finished: publish skipped, needs e2e"). Selection follows the running level, focus stays put.
5. **E2E**: Run with `page.clock` reaches the expected final states; a reduced-motion run is instant; pressing Next during a run stops it.

Suggested commit: `[feat.] simulated run playback for the Pipeline Explorer`

### Step 7 — Home integration

1. **E2E first** (`home.spec.ts`, `mobile.spec.ts`): the pipeline section has a link to `/lab/pipeline`; the mobile menu lists Lab.
2. `PipelineSection`: add the "Explore the real pipeline in the Lab →" `AppLink` under the preview.
3. `smoke.spec.ts`: `@smoke` checks that `/lab` and `/lab/pipeline` render an h1 and the Simulated label. No content assumptions beyond `src/content`.

Suggested commit: `[feat.] link the home pipeline to the Lab`

### Step 8 — Docs and QA

1. README: status table, a "Lab" section (how the Explorer models `ci.yml`, the drift test and what to do when it fails, how to add a demo), test table rows.
2. AGENTS.md: the drift-test rule ("changing `ci.yml` jobs, `needs`, `if:` or step names means updating `src/content/lab-pipeline.ts`"), the no-pinned-refs-in-excerpts rule, and any gotchas found while implementing. Update the plan list at the top (`docs/lab-plan.md`).
3. `docs/prepublish-checklist.md`: Lab copy review, plus Lab items in Final QA (keyboard path, reduced motion, no-JS matrix).
4. Manual QA at 360 / 768 / 1280 / 1920 in both themes: the graph at every width, long step names, the excerpt panel, a run with and without reduced motion, a screen reader pass over the picker, tabs and live region, JavaScript disabled.

Suggested commit: `[docs] Lab documentation`

---

## 6. Definition of done

- [ ] `/lab` and `/lab/pipeline` render, are prerendered at build, and are linked from the nav and the home pipeline section.
- [ ] The Explorer clearly identifies itself as a simulation (L19) and never claims a real deployment.
- [ ] All four scenarios produce the §2 matrix; playback works by keyboard, touch and mouse, stops on interaction and respects reduced motion.
- [ ] Every state is shown as icon + text; `error` passes AA in both themes.
- [ ] The drift test fails when `ci.yml` and the model diverge.
- [ ] No-JS visitors see the outcome matrix.
- [ ] `npm run check`, `npm run build` and `npm run test:e2e` pass, including axe in both themes.
- [ ] README, AGENTS.md and the checklist are updated; drafted copy is marked `TODO(content)`.

## 7. Not in this plan

- Container Explorer and Observability Playground (Phase 5).
- `/about`.
- Live data from GitHub Actions (would need an API call and a "last updated" source, spec §6.4).
- URL-shareable scenario or selection (L15).
- Per-page OG images (L17).

## 8. Risks

| Risk                                                             | Mitigation                                                                                                                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dependabot SHA bumps break the drift test                        | Excerpts never include pinned refs; the test enforces it (L13).                                                                                              |
| A future `ci.yml` change adds an `if:` the model can't express   | The drift test fails with a clear message. Extend `PipelineEvent` or the mapping table, or simplify the job in the model and say so in L18.                  |
| The DAG layout is cramped between `md` and `lg`                  | Use the vertical list below `lg`. The graph only needs to read well where there's room.                                                                      |
| Tabs plus a radio group plus buttons is a heavy keyboard path    | Keep one Tab stop per group (picker, tablist, controls, panel). Verify in the Step 5 e2e and the Step 8 screen reader pass.                                  |
| The timer keeps running on a hidden route (`<Activity>`)         | Stop playback in a `useLayoutEffect` cleanup; covered by the hook test (Step 6).                                                                             |
| Visitors read "passed" on deploy-production as a real deployment | The Simulated badge sits next to the graph, the intro says so, and the panel reason reads "(simulated)". Real evidence is one click away (the Actions link). |
