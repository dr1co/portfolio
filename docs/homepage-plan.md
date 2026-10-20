# Home Page — Implementation Plan

**Feature:** Foundation + Home page (`/`)
**Source specs:** [features-specification.md](features-specification.md), [visual-identity.md](visual-identity.md)
**Branch:** `feat/homepage`. One commit per numbered step. **The repository owner makes the commits.** Each step ends with a suggested commit message and a green check run (`lint`, `typecheck`, `test`).
**Status:** Implemented (steps 0–17). Remaining: content review and manual QA in [prepublish-checklist.md](prepublish-checklist.md). Decisions were settled in a grilling session on 2026-10-15. Working rules (TDD, owner commits, KISS, docs in sync) are in [AGENTS.md](../AGENTS.md).

---

## 1. Decisions

| #   | Topic             | Decision                                                                                                                                                                                                                                                                |
| --- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Scope             | Phase 1 foundation (tokens, theme, layout, nav, footer) **plus** the home page. Built in that order.                                                                                                                                                                    |
| D2  | Unbuilt routes    | Routes live in `site-config.ts` with an `enabled` flag, and nav renders only enabled routes. For now only Home is enabled.                                                                                                                                              |
| D3  | Folder layout     | Move to `src/` (`src/app`, `src/components`, `src/content`, `src/lib`).                                                                                                                                                                                                 |
| D4  | Dependencies      | `next-themes`, `motion`, `lucide-react`. Vitest + React Testing Library + jsdom. Prettier + `prettier-plugin-tailwindcss`. Playwright (+ `@axe-core/playwright`) **now**.                                                                                               |
| D5  | Identity          | Wordmark `adriano.dev` followed by a green `_` cursor. Hero name: **Adriano Matoba Lipski**. Descriptor: "DevOps & Automation".                                                                                                                                         |
| D6  | Links             | GitHub, LinkedIn and email are committed in `src/lib/site-config.ts` and are **empty TODOs for now**. Empty links are never rendered.                                                                                                                                   |
| D7  | Featured projects | Public repos exist, but their details will be added later. `projects.ts` ships empty with a TODO, so the **section is hidden** until a `featured: true` entry exists. The schema and card are still built and tested with fixtures.                                     |
| D8  | Skills            | The draft below is used, marked `TODO(content): review before publish`.                                                                                                                                                                                                 |
| D9  | Hero copy         | Headline "From code to production." Supporting line "Building reproducible environments, automated workflows, and reliable software delivery." **No availability line.**                                                                                                |
| D10 | Hero buttons      | Primary button follows a fallback chain: **Explore Projects** (`#projects`, if any are featured) → **Open GitHub** (if a URL is configured) → **See the pipeline** (`#pipeline`). Secondary button: **Get in touch** (`#contact`), shown only if a contact link exists. |
| D11 | Hero visual       | A static, theme-aware terminal panel labelled **Example**, over a subtle dot grid. It stacks below the text on mobile.                                                                                                                                                  |
| D12 | Section order     | Hero → Featured Projects → Pipeline preview → Skills → Contact → Footer.                                                                                                                                                                                                |
| D13 | Pipeline preview  | **Select-to-reveal.** Five stages in an accessible tablist, a details panel and a terminal snippet, labelled **Simulated**. No auto-run and no next/back buttons. Built from reusable parts so `/lab` can extend it later.                                              |
| D14 | Stage snippets    | GitHub Actions + Docker + GHCR: one shell command and one workflow YAML excerpt per stage, all illustrative.                                                                                                                                                            |
| D15 | Empty contact     | The Contact section and the nav "Contact" shortcut render only when at least one link is configured. In development, a console warning lists the missing values.                                                                                                        |
| D16 | Theme toggle      | Two states. The first visit follows the OS; a click switches to the opposite theme and saves the choice.                                                                                                                                                                |
| D17 | Mobile nav        | A disclosure dropdown (`aria-expanded`, `aria-controls`) that closes on Escape, on link click and when the route is hidden. No focus trap.                                                                                                                              |
| D18 | Motion            | Used for: pipeline selection (`layoutId` indicator + panel cross-fade), section entrances (`whileInView`, once), and the theme-toggle icon swap. All of it respects reduced motion.                                                                                     |
| D19 | E2E scope         | Home smoke test + axe checks in both themes, theme persistence with no flash, pipeline keyboard flow, mobile nav.                                                                                                                                                       |
| D20 | SEO               | Title template, description, robots, and `metadataBase` from `NEXT_PUBLIC_SITE_URL` (localhost fallback). A code-generated `opengraph-image.tsx`.                                                                                                                       |
| D21 | Extras            | A code-generated `icon.tsx` (replaces `favicon.ico`), `not-found.tsx`, and a rewritten README.                                                                                                                                                                          |
| D22 | TODO tracking     | `// TODO(content):` markers in code plus `docs/prepublish-checklist.md`.                                                                                                                                                                                                |

---

## 2. Next.js 16 constraints (verified against `node_modules/next/dist/docs/`)

This project runs **Next 16.4.1** with `cacheComponents: true` and `partialPrefetching: true` (see `next.config.ts`). Re-read the relevant doc before each step. These points affect the plan directly:

1. **No bare `new Date()` / `Date.now()` / `Math.random()` while rendering.** With Cache Components, both server and client components are prerendered, and these calls raise `blocking-prerender-current-time` (or `-random`). The footer year must come from a cached function (`'use cache'` + `cacheLife`); see `01-app/01-getting-started/08-caching.md` → "Random values and timestamps".
2. **Routes are kept mounted in `<Activity mode="hidden">` after navigation.** Transient UI (the mobile menu) must reset itself in a `useLayoutEffect` cleanup and close on `Link`'s `onNavigate`; see `01-app/02-guides/preserving-ui-state.md`. E2E tests must use **visibility-aware selectors** (`getByRole`, `toBeVisible`), because hidden routes stay in the DOM; same guide, "Testing".
3. **OG image and icon** use `ImageResponse` from `next/og`, plus `size`, `contentType` and `alt` exports; see `01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` and `app-icons.md`.
4. **Vitest can't render async Server Components.** Keep tested components synchronous, or cover async ones with Playwright; see `01-app/02-guides/testing/vitest.md`.
5. **`src/` folder:** see `01-app/03-api-reference/03-file-conventions/src-folder.md`. `next.config.ts`, `tsconfig.json`, `public/` and the config files stay at the root.
6. Tailwind v4 is compiled through the `@tailwindcss/turbopack` loader that is already in `next.config.ts`. Don't add a `postcss.config`.
7. `next dev` re-adds the block in `AGENTS.md`. Commit it if it shows up in a diff.

---

## 3. Target file tree (end state of this feature)

```text
.
├── .env.example
├── .prettierrc.json
├── .prettierignore
├── playwright.config.ts
├── vitest.config.mts
├── vitest.setup.ts
├── e2e/
│   ├── home.spec.ts
│   ├── theme.spec.ts
│   ├── pipeline.spec.ts
│   └── mobile-nav.spec.ts
├── docs/
│   ├── homepage-plan.md          (this file)
│   └── prepublish-checklist.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── not-found.tsx
    │   ├── icon.tsx
    │   └── opengraph-image.tsx
    ├── components/
    │   ├── layout/        site-header.tsx, site-footer.tsx, copyright-year.tsx, skip-link.tsx
    │   ├── navigation/    wordmark.tsx, desktop-nav.tsx, mobile-nav.tsx, nav-link.tsx
    │   ├── theme/         theme-provider.tsx, theme-toggle.tsx
    │   ├── terminal/      terminal-panel.tsx
    │   ├── pipeline/      pipeline-preview.tsx, pipeline-node.tsx, pipeline-details.tsx, use-roving-tabs.ts
    │   ├── projects/      project-card.tsx
    │   ├── home/          hero.tsx, featured-projects.tsx, pipeline-section.tsx, skills-section.tsx, contact-section.tsx
    │   └── ui/            button-link.tsx, badge.tsx, container.tsx, section.tsx, external-link.tsx, reveal.tsx, motion-provider.tsx
    ├── content/
    │   ├── projects.ts
    │   ├── skills.ts
    │   └── pipeline.ts
    └── lib/
        ├── site-config.ts
        ├── links.ts           (URL validation + filtering helpers)
        ├── hero-ctas.ts       (fallback chain as a pure function)
        └── cn.ts
```

Unit tests sit next to their sources as `*.test.ts(x)`.

---

## 4. Implementation steps

Each step lists its **goal**, **work**, **acceptance criteria** and a **suggested commit**. Don't start a step until the previous one passes `npm run lint && npm run typecheck && npm test` (and `npm run build` where noted).

### Step 0 — Branch and housekeeping

- `git switch -c feat/homepage`.
- Add `*:Zone.Identifier` to `.gitignore` and delete the two stray `docs/*:Zone.Identifier` files (Windows download metadata).
- Suggested commit: `chore: ignore Windows Zone.Identifier files`

### Step 1 — Move to `src/`

**Work**

- `git mv app src/app`.
- `tsconfig.json`: change `"@/*": ["./*"]` to `"@/*": ["./src/*"]`.
- Run `npm run dev` once and confirm the starter page still renders at `/`.

**Acceptance:** `npm run build` passes, and no `app/` directory remains at the root.
Suggested commit: `refactor: move app router into src/`

### Step 2 — Tooling: deps, formatting, scripts, test runners

**Work**

1. Runtime dependencies: `npm i next-themes motion lucide-react`.
   - Result: `next-themes@0.4.6` peers accept React 19, so no fallback is needed.
2. Dev dependencies (`@types/node` bumped to `^24` because Vitest 5 requires ≥22; the Chromium download needs a network without TLS interception, see AGENTS.md): `npm i -D @types/node@^24 prettier prettier-plugin-tailwindcss vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom vite-tsconfig-paths @playwright/test @axe-core/playwright`, then `npx playwright install chromium`.
3. `.prettierrc.json`: `{ "plugins": ["prettier-plugin-tailwindcss"], "tailwindStylesheet": "./src/app/globals.css" }`. In `.prettierignore`, list `.next`, `node_modules`, `package-lock.json`, `playwright-report`, `test-results`.
4. Run Prettier once over the repo, as its own commit-sized change.
5. `vitest.config.mts`, following the bundled Next guide: `plugins: [tsconfigPaths(), react()]`, `test.environment: 'jsdom'`, `test.setupFiles: ['./vitest.setup.ts']`, `test.include: ['src/**/*.test.{ts,tsx}']`.
   - `vitest.setup.ts` imports `@testing-library/jest-dom/vitest`, mocks `window.matchMedia` (needed by next-themes and motion) and stubs `IntersectionObserver`.
6. `playwright.config.ts`:
   - `testDir: 'e2e'`.
   - `webServer: { command: 'npm run build && npm run start -- -p 3100', port: 3100, reuseExistingServer: !process.env.CI }`. Use the production server so the no-flash check is meaningful.
   - Projects: `desktop-chromium` (1280×800) and `mobile-chromium` (devices['Pixel 7']).
7. `.gitignore`: add `/playwright-report`, `/test-results`, `/blob-report`.
8. `package.json` scripts:
   ```json
   "typecheck": "tsc --noEmit",
   "format": "prettier --write .",
   "format:check": "prettier --check .",
   "test": "vitest run",
   "test:watch": "vitest",
   "test:e2e": "playwright test",
   "check": "npm run lint && npm run typecheck && npm run format:check && npm test"
   ```
9. No placeholder unit test: Vitest uses `passWithNoTests`. The first e2e test, `e2e/smoke.spec.ts`, uses only the `request` fixture (no browser needed) and checks that `/` returns English HTML. `cn` gets added when a component first needs it (KISS).

**Acceptance:** `npm run check` and the e2e smoke test pass.
Suggested commit: `chore: add prettier, vitest, playwright and ui dependencies`

### Step 3 — Design tokens and global styles

**Work** in `src/app/globals.css`:

1. Replace the starter CSS. Define light tokens on `:root` and dark tokens on `[data-theme="dark"]`, exactly as in visual-identity §12, including `color-scheme`.
2. Map the tokens into Tailwind with `@theme inline`: `--color-background`, `--color-surface`, `--color-surface-elevated`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-accent`, `--color-accent-foreground`, `--color-accent-secondary`, `--color-success`, `--color-warning`, `--color-error`, `--color-info`, and `--font-sans` / `--font-mono` from the Geist variables.
3. Theme variant: `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`. Components should rarely need it, because the tokens already switch.
4. Base layer:
   - `body` uses `bg-background text-foreground font-sans`. Remove the `Arial` fallback from the starter.
   - Global `:focus-visible` ring: 2px `--accent` outline with offset.
   - `html { scroll-behavior: smooth }`, but only inside `@media (prefers-reduced-motion: no-preference)`.
   - `scroll-margin-top` on `section[id]` so anchor targets clear the sticky header.
   - A `.dot-grid` utility: a `radial-gradient` of `--border` dots, with lower density below `sm`.
   - A `.cursor-blink` keyframe utility, disabled under `prefers-reduced-motion: reduce`.
5. **Contrast test** `src/app/tokens.test.ts`:
   - Parse `globals.css` with `fs` and a regex, extract both token sets, and compute WCAG contrast ratios.
   - Assert ≥ 4.5:1 for `foreground`, `muted`, `accent`, `accent-secondary`, `warning`, `error` and `info` on both `background` and `surface`.
   - Assert ≥ 3:1 for the focus ring (`accent`) against `background` and `surface` (WCAG 1.4.11 non-text contrast). Decorative `border` is exempt.
   - Assert `accent-foreground` on `accent` ≥ 4.5:1.
   - If a pair fails, adjust the token, record the change in a comment in `globals.css`, and add a line to the README "Design decisions" section. visual-identity §2.3 explicitly allows this.

**Acceptance:** the contrast test passes, the starter page renders with the new tokens, and setting `data-theme="dark"` by hand in devtools switches the palette.
Suggested commit: `feat(design): add Terminal Modern tokens with contrast tests`

### Step 4 — Site config and link helpers

**Work**

1. `src/lib/site-config.ts`, with an exported typed `siteConfig` (`as const satisfies SiteConfig`):
   ```ts
   type NavRoute = {
     href: "/" | "/projects" | "/lab" | "/about";
     label: string;
     enabled: boolean;
   };
   type SiteConfig = {
     name: string; // 'Adriano Matoba Lipski'
     wordmark: string; // 'adriano.dev'
     descriptor: string; // 'DevOps & Automation'
     headline: string; // 'From code to production.'
     tagline: string; // 'Building reproducible environments, automated workflows, and reliable software delivery.'
     intro: string; // short intro paragraph — TODO(content)
     heroTags: readonly string[]; // ['Docker', 'CI/CD', 'Python', 'Linux']
     routes: readonly NavRoute[]; // only '/' enabled
     links: { github: string; linkedin: string; email: string }; // all '' — TODO(content)
     sourceRepoUrl: string; // '' — TODO(content), footer "Source" link
   };
   ```
   The intro draft is "Software developer working on backend services, containerized development environments and CI/CD automation — currently deepening that work toward DevOps." It's marked `TODO(content)` for the owner to edit.
2. `src/lib/links.ts`:
   - `isHttpUrl(value)` uses `new URL` and accepts only `https:`.
   - `isEmail(value)` is a simple RFC-lite regex.
   - `getContactLinks(config)` returns `{ kind: 'github' | 'linkedin' | 'email'; href; label }[]`, skipping empty or invalid values. Email becomes `mailto:`.
   - `getEnabledRoutes(config)`.
   - `warnMissingContent(config)` logs a `console.warn` in development only, listing the missing links.
3. `src/lib/hero-ctas.ts`, a pure `resolveHeroCtas({ featuredCount, githubUrl, hasContact })` that returns `{ primary: Cta; secondary?: Cta }` following D10.
4. Tests:
   - `links.test.ts`: empty, invalid and `http:` values are rejected; email becomes `mailto:`; order is preserved.
   - `hero-ctas.test.ts`: all four combinations of projects/GitHub/neither × contact on/off.

**Acceptance:** tests pass, and the config contains no hard-coded colors or UI.
Suggested commit: `feat(config): add typed site config, link validation and hero CTA resolver`

### Step 5 — Theme system

**Work**

1. `components/theme/theme-provider.tsx` (`'use client'`) wraps `next-themes` with `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem` and `disableTransitionOnChange`.
2. `layout.tsx`: put `suppressHydrationWarning` on `<html>` (the theme attribute is set before hydration).
3. `components/theme/theme-toggle.tsx` (`'use client'`):
   - Render **both** the Sun and Moon icons. Visibility is driven by CSS from `data-theme`, so the server HTML is already correct and nothing flashes.
   - The click handler calls `setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')`.
   - The accessible name comes from a mount check (`useSyncExternalStore` returning `true` on the client, `false` on the server). Before mount it reads "Toggle theme"; after mount, "Switch to light theme" / "Switch to dark theme".
   - Motion: wrap the icon in `AnimatePresence mode="wait"` with a 150ms rotate+fade, keyed by the resolved theme after mount.
   - The hit area is at least 40×40px and the button has a visible focus ring.
4. Tests (`theme-toggle.test.tsx`):
   - Renders a button.
   - Clicking it toggles `data-theme` on `document.documentElement` (render it inside the provider; the `matchMedia` mock comes from the setup file).
   - The accessible name updates after the click.

**Acceptance:**

- With OS dark mode, the first visit is dark; with OS light mode, it's light.
- The choice survives a reload.
- A production build shows no wrong-theme flash. Check by throttling to Slow 3G and reloading.

Suggested commit: `feat(theme): add persistent light/dark theme with system default`

### Step 6 — UI primitives

All of these are server-compatible unless marked otherwise. Colors come only from tokens.

| Component                                 | Responsibility                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/container.tsx`                        | `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`                                                                                                                                                                                                                                                       |
| `ui/section.tsx`                          | Props `id`, `title`, `eyebrow?`, `description?`, `children`. Renders `<section aria-labelledby>` with an `h2` and an optional mono eyebrow (e.g. `// pipeline`). Vertical spacing is `py-12 md:py-20`.                                                                                                |
| `ui/button-link.tsx`                      | `variant: 'primary' \| 'secondary'`. Uses `next/link` for internal and hash links and `<a>` for external ones. Primary is `bg-accent text-accent-foreground`; secondary is a bordered surface. `min-h-11`, 150ms transition.                                                                          |
| `ui/external-link.tsx`                    | `target="_blank" rel="noopener noreferrer"`, a small Lucide `ArrowUpRight` icon, and `<span class="sr-only">(opens in a new tab)</span>`.                                                                                                                                                             |
| `ui/badge.tsx`                            | `variant: 'neutral' \| 'accent' \| 'simulated' \| 'learning' \| 'status'`. Mono `text-xs`. `simulated` and `learning` always include an icon **and** text (FlaskConical "Simulated", Sprout "Currently learning").                                                                                    |
| `ui/motion-provider.tsx` (`'use client'`) | `<MotionConfig reducedMotion="user">`, mounted once in the layout.                                                                                                                                                                                                                                    |
| `ui/reveal.tsx` (`'use client'`)          | `motion.div` with `initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-80px'}} transition={{duration:0.3}}`. When `useReducedMotion()` is true, render a plain `div`. Content is visible in the server HTML; only below-the-fold sections use it, never the hero. |

**Progressive enhancement note:** Motion's `initial` styles are applied in the SSR output. To keep the content readable without JavaScript, `Reveal` applies `initial` only after mount: set `initial={false}` until a mount flag flips. Alternatively, add `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>` in the layout. **Choose the `noscript` style**: it's simpler and avoids a re-render.

Tests: a `badge.test.tsx` snapshot of the accessible text for each variant, and `button-link.test.tsx` (external links get `rel`, internal links don't).

Suggested commit: `feat(ui): add layout, button, badge and motion primitives`

### Step 7 — Layout shell: header, navigation, footer

**Work**

1. `navigation/wordmark.tsx`: `<Link href="/">`, `adriano.dev` in mono with a `<span aria-hidden className="cursor-blink text-accent">_</span>`. Accessible name: "adriano.dev — home".
2. `navigation/nav-link.tsx` (`'use client'`): `usePathname()` sets `aria-current="page"`. The active state is a 2px underline plus `text-foreground` (inactive links are `text-muted`), so it's indicated by more than color.
3. `navigation/desktop-nav.tsx` lists enabled routes (`hidden md:flex`). With only Home enabled it renders just "Home"; that's accepted for now.
4. Header utilities group:
   - GitHub icon link, only if configured (`aria-label="GitHub profile"`, external).
   - "Contact" shortcut to `/#contact`, only if `getContactLinks().length > 0`.
   - `ThemeToggle`.
5. `navigation/mobile-nav.tsx` (`'use client'`, `md:hidden`):
   - Button with Lucide `Menu`/`X`, `aria-expanded`, `aria-controls="mobile-menu"`, and the label "Open menu" / "Close menu".
   - The panel is a `<nav aria-label="Mobile">` below the header, holding the enabled routes plus the Contact shortcut.
   - It closes on Escape (key listener while open, with focus returned to the button), on link click (`onNavigate` on each `Link`), and on outside click.
   - **Activity reset:** a `useLayoutEffect(() => () => setOpen(false), [])` cleanup, per the preserving-ui-state guide.
   - If no route other than Home and no contact link exist, don't render the menu button at all (nothing to show). The wordmark and the toggle remain.
6. `layout/site-header.tsx`: sticky `top-0 z-40`, `bg-background/80 backdrop-blur border-b border-border`, height 64px. Layout: wordmark on the left; nav and utilities on the right.
7. `layout/skip-link.tsx`: "Skip to content" → `#main`, visible on focus.
8. `layout/copyright-year.tsx`:
   ```tsx
   import { cacheLife } from "next/cache";
   export async function CopyrightYear() {
     "use cache";
     cacheLife("days");
     return <>{new Date().getFullYear()}</>;
   }
   ```
   Check the exact `cacheLife` import path against `01-app/03-api-reference/04-functions/cacheLife.md` before writing this.
9. `layout/site-footer.tsx`:
   - `© <CopyrightYear/> Adriano Matoba Lipski`.
   - "Built with Next.js, TypeScript and Tailwind CSS".
   - "Source" link only if `sourceRepoUrl` is set.
   - The contact links again (same helper).
   - No status indicator (spec §4.5).
10. `app/layout.tsx`: Geist fonts (keep them), `ThemeProvider`, `MotionProvider`, the `noscript` reveal style, `SkipLink`, `SiteHeader`, `<main id="main" className="flex-1">`, `SiteFooter`. Call `warnMissingContent(siteConfig)` at module scope in the layout; it's development-only.

**Tests:**

- `nav-link.test.tsx`: mock `next/navigation`'s `usePathname` and check `aria-current`.
- `mobile-nav.test.tsx`: toggle, Escape closes the menu and restores focus, `aria-expanded` stays in sync.

**Acceptance:** keyboard order is skip link → wordmark → nav → utilities → main. At 375px nothing overflows. Both themes are readable.
Suggested commit: `feat(layout): add site header, navigation, theme toggle and footer`

### Step 8 — Metadata, OG image, icon, not-found, env

**Work**

1. `.env.example`:
   ```bash
   # Public origin of the deployed site, used for canonical URLs and OG metadata.
   # Leave unset locally; falls back to http://localhost:3000.
   NEXT_PUBLIC_SITE_URL=
   # Set to "true" only on the production deployment to allow indexing.
   NEXT_PUBLIC_ALLOW_INDEXING=
   ```
2. Root `metadata` in `layout.tsx`:
   - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')`
   - `title: { default: 'Adriano Matoba Lipski — DevOps & Automation', template: '%s · Adriano Matoba Lipski' }`
   - `description` set to the tagline.
   - `openGraph` (`type: 'website'`, `siteName`, `locale: 'en_US'`) and `twitter: { card: 'summary_large_image' }`.
   - `robots: { index: allowIndexing, follow: allowIndexing }`.
   - `alternates.canonical: '/'`, only when `NEXT_PUBLIC_SITE_URL` is set.
3. `app/opengraph-image.tsx`: `ImageResponse` from `next/og`, 1200×630, `contentType 'image/png'`, and `alt`. It shows a Graphite background, `adriano.dev_` in green mono, the headline in Soft White and the descriptor in Slate. Colors are literal hex here, which is acceptable because CSS variables don't exist inside `ImageResponse`; add a comment referencing the tokens.
4. `app/icon.tsx`: 32×32 `ImageResponse` with a green `>_` on Graphite and rounded corners. Delete `src/app/favicon.ico` and the unused starter SVGs in `public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).
5. `app/not-found.tsx`:
   - Inside `Container`, a `TerminalPanel` titled `404 / not-found` showing `$ cd <requested path>` / `bash: no such route`.
   - An h1 "Page not found", a line of copy, and a `ButtonLink` "Back to home". Projects links are omitted because that route isn't enabled; reuse `getEnabledRoutes`.

**Acceptance:**

- `npm run build` passes.
- `/opengraph-image` and `/icon` render.
- Unknown URLs show the 404 page with status 404.
- The page source has `noindex` when `NEXT_PUBLIC_ALLOW_INDEXING` is unset.

Suggested commit: `feat(seo): add metadata, generated OG image and icon, and not-found page`

### Step 9 — Content modules

**Work**

1. `content/projects.ts`:
   ```ts
   export type ProjectStatus = "available" | "in-progress" | "planned";
   export type Project = {
     slug: string;
     title: string;
     summary: string;
     description: string;
     status: ProjectStatus;
     technologies: readonly string[];
     categories: readonly string[];
     repositoryUrl?: string;
     demoUrl?: string;
     caseStudy?: string;
     featured: boolean;
     lastUpdated?: string; // ISO date, factual only
   };
   // TODO(content): add the public repositories (name, repo URL, one-line summary, honest status).
   export const projects: readonly Project[] = [];
   export function getFeaturedProjects(list = projects): Project[];
   ```
   `getFeaturedProjects` filters `featured`, excludes `planned` (spec: don't publish unimplemented cards), caps the result at 4, and strips invalid URLs via `isHttpUrl`.
2. `content/skills.ts`:
   ```ts
   export type Skill = { name: string; learning?: boolean };
   export type SkillGroup = {
     id: string;
     title: string;
     skills: readonly Skill[];
   };
   // TODO(content): review every entry before publishing — only list what you can discuss.
   ```
   Draft data:
   - **Containers & Delivery:** Docker, Docker Compose, GitHub Actions
   - **Backend & Automation:** Python, Django, Flask
   - **Databases:** PostgreSQL
   - **Development & Collaboration:** Git, Linux, Dev Containers
   - **Learning Next** (all `learning: true`): Kubernetes, Terraform, AWS
3. `content/pipeline.ts`:

   ```ts
   export type StageState =
     "pending" | "running" | "passed" | "failed" | "skipped"; // for /lab later; unused on home
   export type PipelineStage = {
     id: "push" | "build" | "test" | "publish" | "deploy";
     label: string;
     icon:
       "GitCommitHorizontal" | "Hammer" | "FlaskConical" | "Package" | "Rocket";
     purpose: string; // one sentence
     explanation: string; // 2–3 sentences, plain English
     command: string; // illustrative shell
     workflow: string; // GitHub Actions YAML excerpt
     reference: string; // e.g. '.github/workflows/ci.yml'
   };
   ```

   Draft stage content (all illustrative, `TODO(content)` for wording review):

   | Stage         | Purpose                                                                                       | Command                                       | Workflow excerpt (key lines)                                                                                             |
   | ------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
   | Git Push      | A commit to `main` or a pull request triggers the workflow.                                   | `git push origin main`                        | `on: { push: { branches: [main] }, pull_request: {} }`                                                                   |
   | Build         | Build a reproducible image from a pinned base with a multi-stage Dockerfile.                  | `docker build -t app:$GIT_SHA .`              | `- uses: docker/setup-buildx-action@<pinned-sha>` / `- run: docker build -t app:${{ github.sha }} .`                     |
   | Test          | Run lint and tests inside the built image, so CI tests what ships.                            | `docker run --rm app:$GIT_SHA pytest -q`      | `- run: docker run --rm app:${{ github.sha }} pytest -q`                                                                 |
   | Publish Image | Push an immutable, SHA-tagged image to GHCR with least-privilege permissions.                 | `docker push ghcr.io/<owner>/app:$GIT_SHA`    | `permissions: { contents: read, packages: write }` / `- uses: docker/login-action@<pinned-sha>` with `registry: ghcr.io` |
   | Deploy        | Pull the exact tagged image on the target and restart, keeping the previous tag for rollback. | `docker compose pull && docker compose up -d` | `environment: production` / `- run: ssh deploy@host "IMAGE_TAG=${{ github.sha }} docker compose up -d"`                  |

   Use `<owner>` / `host` placeholders, never real hostnames (spec §11).

4. Tests:
   - `projects.test.ts`, using fixtures: planned projects are excluded, the cap is 4, invalid URLs are stripped, an empty list gives an empty result.
   - `pipeline.test.ts`: exactly 5 stages in order, and ids are unique.
   - `skills.test.ts`: no duplicate names across groups.

Suggested commit: `feat(content): add typed project, skill and pipeline content`

### Step 10 — Terminal panel

`components/terminal/terminal-panel.tsx` is a server component that is also reused inside the client pipeline:

- Props: `title` (e.g. `pipeline-demo / main`), `badge?: ReactNode`, `lines?` or `children`, `language?`, `copyable?: boolean`.
- Structure: a `<figure>` holding a header bar (three neutral dots `aria-hidden`, mono title, badge on the right) and a `<pre><code>` body with `overflow-x-auto` (it scrolls inside the panel and never overflows the page). Prompt lines render `$` in `text-accent` with `aria-hidden` on the `$`.
- Surface: `bg-surface border border-border rounded-lg`. The code text is `text-foreground` / `text-muted`, so it's readable in both themes (no hard-coded dark panel in light mode).
- Copy button (`'use client'` island, only when `copyable`): `navigator.clipboard.writeText`, an `aria-live="polite"` "Copied" message that clears after 2s, Lucide `Copy`/`Check` icons, and the label "Copy command".
- Test: the copy button calls the clipboard and announces "Copied".

Suggested commit: `feat(terminal): add accessible terminal presentation panel`

### Step 11 — Hero

`components/home/hero.tsx` (server):

- Layout: `grid gap-10 md:grid-cols-[1.1fr_1fr] items-center`, `py-16 md:py-24`, with a `.dot-grid` decorative background layer (`aria-hidden`, masked to fade at the edges).
- Left column, in this order:
  1. An eyebrow `<p>` in mono: `Adriano Matoba Lipski · DevOps & Automation`.
  2. **`<h1>` "From code to production."**, `text-4xl sm:text-5xl font-semibold tracking-tight`. This is the page's only h1; the name sits in the eyebrow and in the `<title>`.
  3. The tagline, `text-lg text-muted max-w-prose`.
  4. The intro paragraph.
  5. Tags: `heroTags` as `Badge variant="neutral"` in a `<ul aria-label="Core technologies">`.
  6. Buttons from `resolveHeroCtas(...)`.
- Right column: a `TerminalPanel` titled `~/portfolio` with `<Badge variant="simulated">Example</Badge>`. Content:
  ```text
  $ docker compose up -d
  ✔ Network portfolio_default  Created
  ✔ Container portfolio-db-1   Started
  ✔ Container portfolio-app-1  Started
  $ curl -s localhost:8000/health
  {"status": "ok"}
  ```
  `figcaption` (sr-only): "Example terminal output, not a live system."
- No entrance animation on the hero (it's critical content, LCP).
- Test `hero.test.tsx`: one h1, tags rendered, and the correct button for a fallback scenario (pass config as props so it's testable).

Suggested commit: `feat(home): add hero section`

### Step 12 — Featured projects section

- `projects/project-card.tsx`:
  - An `<article>` with an h3 title, the summary, at most 5 technology badges, and a status badge (text + icon: `CheckCircle2` Available, `Clock` In progress).
  - Links: "Source" (external, only when `repositoryUrl` is valid), "Live demo" (only when `demoUrl` is valid), and "Case study" only when the `/projects` route is enabled **and** `caseStudy` exists.
  - Hover: border goes to `accent/50` and the surface goes to `surface-elevated`. Nothing is hover-only.
- `home/featured-projects.tsx`: `Section id="projects" eyebrow="// projects" title="Featured projects"`, a `grid gap-6 md:grid-cols-2`. **Returns `null` when `getFeaturedProjects()` is empty.**
- Tests with fixtures: the card hides missing links and the status has a text label; the section renders nothing when empty.

Suggested commit: `feat(home): add featured projects section`

### Step 13 — Pipeline preview

**Structure**

- `home/pipeline-section.tsx` (server):
  - `Section id="pipeline" eyebrow="// pipeline" title="How code reaches production"`.
  - A description line plus `<Badge variant="simulated">Simulated</Badge>` and the sentence: "This is an illustrative walkthrough. It does not run or trigger a real pipeline."
  - Renders `<PipelinePreview stages={pipelineStages} />`.
  - A `<noscript>` fallback: an `<ol>` of all five stages with purpose and command, so the content is available without JavaScript.
- `pipeline/pipeline-preview.tsx` (`'use client'`) implements the **WAI-ARIA Tabs pattern with automatic activation**:
  - The `role="tablist"` has `aria-label="Delivery pipeline stages"`.
  - Each `PipelineNode` is a `role="tab"` button with `aria-selected`, `aria-controls`, `id`, and a roving `tabIndex` (0 on the selected tab, -1 on the others).
  - `use-roving-tabs.ts` hook: ArrowRight/ArrowDown → next, ArrowLeft/ArrowUp → previous (both wrap), Home/End → first/last. Selection follows focus. Handling both arrow axes covers the horizontal desktop and vertical mobile layouts without changing `aria-orientation` at runtime.
  - Initial selection is `push`. The server renders the first stage's panel, so the preview isn't empty before hydration.
- `pipeline/pipeline-node.tsx`:
  - Contents: Lucide icon, a stage number (`01`–`05` in mono), the label.
  - Selected state: `border-accent`, `bg-surface-elevated`, bold label, and a Motion `layoutId="pipeline-active"` indicator bar under or beside the node. Selection is shown by shape and weight, not color alone.
  - Connectors between nodes are decorative `aria-hidden` lines: horizontal on `md+`, vertical below.
- `pipeline/pipeline-details.tsx` is the `role="tabpanel"` with `aria-labelledby` and `tabIndex={0}`. It contains:
  - An h3 with the stage label, the purpose (`text-lg`) and the explanation.
  - A `TerminalPanel` titled `pipeline-demo / main`, `copyable`, showing `command`.
  - A `<details>` "Workflow excerpt" holding a second `TerminalPanel` with the YAML and `reference` as its title. Native `<details>` works with keyboard and without JavaScript.
  - Panel swap: `AnimatePresence mode="wait"` with a 180ms opacity/y-4 cross-fade. Under reduced motion, `MotionConfig` disables the transform and the swap is instant.
- Layout:
  - `md+`: a horizontal row of 5 nodes across the full container width, with the panel below.
  - `<md`: a vertical list of nodes with the panel below the list. Don't interleave, which keeps the tabs pattern valid.
  - No horizontal scroll.

**Tests (`pipeline-preview.test.tsx`, user-event):**

- 5 tabs; the first is selected.
- ArrowRight moves focus and selection; ArrowLeft from the first wraps to the last; Home/End work.
- Clicking a tab shows its command in the panel.
- Exactly one tab has `tabIndex=0`.
- The "Simulated" label is present.
- No real-success language. Assert that the panel text doesn't contain "deployed successfully".

Suggested commit: `feat(pipeline): add simulated, keyboard-accessible pipeline preview`

### Step 14 — Skills section

- `home/skills-section.tsx`:
  - `Section id="skills" eyebrow="// skills" title="Skills by domain"`, a `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
  - Each group is a card with an h3 and a `<ul>` of mono labels.
  - The **Learning Next** group's card has a dashed border (an allowed "meaningful" use per visual-identity §4.4) and a `Badge variant="learning"`, plus the line: "Active learning areas — not yet used in a substantive project."
  - Individual `learning: true` items in other groups get a small inline "learning" badge.
- No logos and no icon wall.
- Test: the learning badge appears with text, and the group headings render as h3.

Suggested commit: `feat(home): add skills overview`

### Step 15 — Contact section and page assembly

1. `home/contact-section.tsx`:
   - `Section id="contact" eyebrow="// contact" title="Get in touch"`.
   - A short line: "The best way to reach me is by email or LinkedIn." Wording adapts to which links exist.
   - A list of `getContactLinks()` items, each a large tappable row with a Lucide icon, label and visible handle/host.
   - **Returns `null` when there are no links.**
   - Lucide removed brand icons in recent versions, so check `Github`/`Linkedin` exist in the installed version. If they don't, use a small local SVG set in `components/ui/brand-icons.tsx` (decorative, `aria-hidden`), with text labels always shown.
2. `app/page.tsx` (server, synchronous):
   ```tsx
   <Hero />
   <Reveal><FeaturedProjects /></Reveal>
   <Reveal><PipelineSection /></Reveal>
   <Reveal><SkillsSection /></Reveal>
   <Reveal><ContactSection /></Reveal>
   ```
   Make sure `Reveal` doesn't render an empty wrapper when its child returns `null`. Either check emptiness in the parent, which already knows (`getFeaturedProjects().length`, `getContactLinks().length`), or have the sections wrap their own content in `Reveal`. **Choose the latter.**
3. Page `metadata` isn't needed (the root default covers `/`).
4. Run `npm run build` and confirm the build output marks `/` as prerendered (static shell) with no prerender errors.

Suggested commit: `feat(home): add contact section and assemble home page`

### Step 16 — End-to-end tests

All tests use role-based, visibility-aware locators (Next 16 keeps hidden routes in the DOM).

- **`e2e/home.spec.ts`**
  - The page has exactly one visible h1, "From code to production."
  - The Pipeline and Skills sections are visible.
  - Projects and Contact are **absent** (the current content state). Write this as `expect(locator).toHaveCount(0)` with a comment telling future readers to flip it when content lands.
  - The primary hero button is "See the pipeline", and clicking it scrolls `#pipeline` into view.
  - **axe:** `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()` has zero violations, in both `colorScheme: 'light'` and `'dark'` (`page.emulateMedia`).
- **`e2e/theme.spec.ts`**
  - With the emulated OS set to dark, the first load has `html[data-theme="dark"]`.
  - Click the toggle → `light`; reload → still `light`.
  - **No-flash check:** `page.addInitScript` registers a `MutationObserver` that records every `data-theme` value from the earliest moment, then reloads. Assert the recorded list never contains the wrong theme before the persisted one, and that `data-theme` is already set at `DOMContentLoaded`.
- **`e2e/pipeline.spec.ts`**
  - Tab into the tablist, ArrowRight ×2 → "Test" is selected and its panel shows `pytest`.
  - End → "Deploy"; Home → "Git Push".
  - Opening "Workflow excerpt" shows YAML.
  - The copy button announces "Copied". Grant the `clipboard-read` / `clipboard-write` permissions in the context.
- **`e2e/mobile-nav.spec.ts`** (`mobile-chromium` project only)
  - No horizontal overflow: `document.documentElement.scrollWidth <= innerWidth`.
  - The pipeline nodes are stacked vertically: compare the bounding boxes of nodes 1 and 2.
  - **Mobile menu:** with the current content the menu button isn't rendered (nothing to show besides Home), so assert its absence. Add a `test.fixme` describing the open → Escape → link-click flow, to be enabled once a second route or a contact link exists. Don't add test-only switches to the app; the open/close behavior is already covered by the Vitest test from Step 7.

Suggested commit: `test(e2e): add home, theme, pipeline and mobile playwright specs`

### Step 17 — Docs: README and pre-publish checklist

1. Rewrite `README.md`:
   - Purpose and link to the specs.
   - Stack and important version notes: Next 16 with Cache Components, and the next-themes/React compatibility result from Step 2.
   - Prerequisites (Node version from `engines` — add `"engines": { "node": ">=20.9" }` to `package.json`).
   - Scripts table.
   - Running tests: unit, plus e2e with `npx playwright install chromium`.
   - Content editing guide (`src/content/*`, `src/lib/site-config.ts`).
   - Env vars (`.env.example`).
   - Design decisions, including any token adjustments from Step 3.
   - Known limitations.
2. `docs/prepublish-checklist.md`:
   - [ ] Fill `links.github`, `links.linkedin`, `links.email` in `site-config.ts` (or remove the ones you won't publish).
   - [ ] Review the `intro` copy and `heroTags`.
   - [ ] Review `skills.ts`: only technologies you can discuss, with the learning flags correct.
   - [ ] Add real public projects to `projects.ts` with honest statuses; then flip the e2e expectations in `home.spec.ts`.
   - [ ] Review the pipeline stage copy for accuracy.
   - [ ] Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING=true` in production only.
   - [ ] Set `sourceRepoUrl` if the repo is public.
   - [ ] `grep -rn "TODO(content)" src` returns nothing.
   - [ ] Confirm nothing employer-owned or internal appears anywhere.
   - [ ] Run the manual QA (§5) in both themes.

Suggested commit: `docs: add README and pre-publish checklist`

---

## 5. Manual QA (before opening the PR)

- **Widths:** 360, 414, 768, 1024, 1440, 1920. No horizontal scroll; the hero h1 never overflows; terminal panels scroll internally.
- **Themes:** every section in light and dark, including focus rings, badges, the selected pipeline node, terminal text and the 404 page.
- **Keyboard only:** skip link, header, hero buttons, pipeline tabs (arrows/Home/End), `<details>`, copy button, footer. Focus is always visible.
- **Reduced motion** (OS setting or devtools emulation): no entrance motion, no cursor blink, instant panel swap, no smooth scroll.
- **JavaScript disabled:** all section content is readable (reveal `noscript` style, pipeline `noscript` list). The theme follows the OS.
- **Touch:** nothing depends on hover.
- **Lighthouse** (mobile, production build): Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO ≥ 90 (SEO flags `noindex`, which is expected while indexing is off). CLS ≈ 0.
- **Screen reader** spot check (NVDA or VoiceOver): heading outline is h1 → h2 per section → h3 cards/stage. The pipeline announces "tab, 1 of 5, selected".

---

## 6. Definition of Done for this feature

- [ ] Steps 0–17 implemented.
- [ ] `npm run check`, `npm run build` and `npm run test:e2e` all pass.
- [ ] No hard-coded hex colors outside `globals.css`, `opengraph-image.tsx` and `icon.tsx`. Verify with `grep -rnE "#[0-9a-fA-F]{6}" src`.
- [ ] Nothing claims real deployment or health. The pipeline and hero terminal are labelled Simulated/Example.
- [ ] No empty or placeholder links are rendered.
- [ ] Manual QA (§5) completed.
- [ ] PR opened from `feat/homepage` to `main`.

---

## 7. Explicitly not in this feature

- `/projects`, `/projects/[slug]`, `/lab`, `/about` pages (each is its own future plan; they get switched on through `routes[].enabled`).
- The full Pipeline Explorer (next/back, simulated run, pending/running/passed/failed states). The `StageState` type is reserved for it.
- Docker image, GitHub Actions workflows and GHCR publishing for this site (Phase 4).
- Analytics, a contact form, a blog.

## 8. Risks and mitigations

| Risk                                                                           | Mitigation                                                                       |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `next-themes` is incompatible with React 19.3 or Cache Components prerendering | Check in Step 2; fall back to an in-house provider + inline script (documented). |
| Motion `initial` styles hide content without JavaScript                        | `noscript` override style (Step 6).                                              |
| A token pair fails WCAG AA                                                     | The contrast unit test catches it; adjust the token and document it (Step 3).    |
| A prerender error from the current time                                        | Use the cached `CopyrightYear` only; no other `Date` usage while rendering.      |
| A hidden Activity route leaks into tests or the UI                             | Visibility-aware locators; the mobile menu resets in `useLayoutEffect` cleanup.  |
| Lucide no longer ships brand icons                                             | A local decorative SVG fallback (Step 15).                                       |
