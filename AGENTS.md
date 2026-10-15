<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

Portfolio site for Adriano Matoba Lipski. Product spec: `docs/features-specification.md`. Design system: `docs/visual-identity.md`. Active feature plan: `docs/homepage-plan.md`.

**Keep this file current.** When a convention changes or you hit a gotcha that would trip the next agent, update this file in the same change. An outdated AGENTS.md is worse than none.

## Workflow

- **Never commit or push.** The owner reviews and commits every step. Work in steps that can be reviewed. At the end of each step, stop, list the changed files with a one-line summary each, and suggest a commit message. Then wait to be told to continue.
- **TDD, vertical slices.** One failing test → minimal code to pass → repeat. Don't write all the tests first. Unit and component tests live next to their source as `*.test.ts(x)` (Vitest). End-to-end tests live in `e2e/*.spec.ts` (Playwright). Test behavior through public interfaces. Agree the test seams with the owner before testing a new area.
- **Definition of green:** `npm run check` (lint + typecheck + format check + unit tests), then `npm run build` and `npm run test:e2e` when routes or rendering change.
- **Docs stay in sync.** After each step, update `README.md` (and any doc in `docs/` the step affects) so a newcomer can understand, run and contribute.

## Code conventions

- **KISS, but generalize when it's cheap.** If a component, handler or helper can serve more than one scenario without bending its core, make it generic (e.g. one `ButtonLink` with variants, not three buttons). Don't add speculative options.
- **Comments:** minimal. Document exported functions and components with a short docstring (`/** ... */`). Avoid inline comments unless the _why_ isn't obvious from the code. Longer explanations go in `README.md`.
- **Server components by default.** Add `'use client'` only for interactivity, theme or browser APIs, and keep client islands small.
- **Colors only via semantic tokens** (`bg-surface`, `text-muted`, `border-border`, ...) defined in `src/app/globals.css`. No raw hex in components. The only exceptions are `ImageResponse` files (`opengraph-image.tsx`, `icon.tsx`), where CSS variables don't exist.
- **Content is data.** Copy, links, projects, skills and pipeline stages live in `src/content/` and `src/lib/site-config.ts`, never inline in components. Unreviewed content carries `// TODO(content):` and is listed in `docs/prepublish-checklist.md`.
- **Never render empty or placeholder links.** Validate through `src/lib/links.ts` helpers.
- **Accessibility is a requirement:** semantic HTML, one `h1` per page, visible focus, keyboard support, state never shown by color alone, and `prefers-reduced-motion` respected.
- **Imports:** use the `@/` alias (maps to `src/`).
- Formatting is Prettier with the Tailwind class-sorting plugin. Run `npm run format`.

## Environment gotchas

- The repo lives in WSL. Run npm/node from inside WSL (`wsl.exe -d Ubuntu -- bash -ic 'cd ~/adriano/projetos/portfolio && ...'`). `-i` is needed so nvm loads. `node_modules` contains Linux-native binaries, so Windows node won't work.
- On some networks a TLS-intercepting proxy blocks `npx playwright install` (`SELF_SIGNED_CERT_IN_CHAIN`); npm and Google Fonts are unaffected. Install from another network or set `NODE_EXTRA_CA_CERTS`. Chromium is currently installed in `~/.cache/ms-playwright`.
- `npm run typecheck` reads route types from `.next/types`. After moving or renaming routes, run `npx next typegen` (or a build) first, or tsc reports stale `../../app/*.js` errors.
- `cacheComponents` is on: `new Date()`, `Date.now()` and `Math.random()` while rendering (server **or** client) fail prerendering. Wrap them in a `'use cache'` function or defer with `connection()`.
- With `cacheComponents`, navigated-away routes stay mounted under `<Activity mode="hidden">`. Reset transient UI (menus, popovers) in a `useLayoutEffect` cleanup. E2E tests must use visibility-aware locators.
- `@types/node` is pinned to `^24` because Vitest 5 requires ≥22.
