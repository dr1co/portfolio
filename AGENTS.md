<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

Portfolio site for Adriano Matoba Lipski. Product spec: `docs/features-specification.md`. Design system: `docs/visual-identity.md`. Feature plans: `docs/homepage-plan.md` (done), `docs/projects-plan.md` (done), `docs/delivery-plan.md` (planned). Remaining content work is tracked in `docs/prepublish-checklist.md`.

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
- From Windows tools, `mkdir -p` on the `\wsl.localhost` UNC path fails. Create directories from inside WSL (`wsl.exe ... mkdir -p`) or let the Write tool create them.
- jsdom's accessible-name computation drops the space before `sr-only` text (e.g. "Open GitHub(opens in a new tab)"). Browsers don't. Match such names in unit tests with a whitespace-tolerant regex.
- `lucide-react` 1.x has no brand icons (GitHub, LinkedIn). Use `src/components/ui/contact-icons.tsx`.
- Next's `Link` accepts `onNavigate`, but a plain `<a>` doesn't. `AppLink` routes props accordingly. Use `AppLink` for every link instead of choosing between `Link` and `<a>` yourself.
- `next start` runs the real server as a `next-server` child process, so `pkill -f "next start"` leaves it running. Stop servers by port: `fuser -k 3200/tcp`. Playwright reuses whatever is already listening on **3100** outside CI, so a leftover server makes e2e tests run against an old build. Free the port before trusting results. Don't kill the owner's `next dev`.
- Props passed from server to client components must be serializable. Content that a client component renders (e.g. pipeline stages) refers to icons by string key, mapped to Lucide components on the client.
- Content inside `Section` is wrapped in `Reveal` (Motion `whileInView`). It starts at `opacity: 0`, and the stubbed `IntersectionObserver` never fires in jsdom, so `toBeVisible()` fails in unit tests. Assert `toBeInTheDocument()` there. In Playwright, scroll sections into view before visual or axe checks (see `revealAllSections` in `e2e/home.spec.ts`).
- Some e2e expectations depend on content (e.g. hero buttons "Explore Projects" / "Get in touch", which only exist while projects and contact links are configured). If you remove content from `projects.ts` or `site-config.ts`, update `e2e/home.spec.ts` and `e2e/mobile.spec.ts` with it.
- MDX: `next.config.ts` wraps the config with `createMDX`. Add remark/rehype plugins **as strings** (`"rehype-slug"`, `["@shikijs/rehype", {...}]`) with JSON-serializable options only (Turbopack restriction). Keep `@next/mdx` pinned to the same version as `next`.
- Shiki code blocks render as `<pre class="shiki">` with per-token `--shiki-light`/`--shiki-dark` variables. Colors are chosen in `globals.css` by `data-theme`, so don't set Shiki's `defaultColor`.
- When writing files containing backticks (MD/MDX code fences) from a shell, double-quoted `bash -ic "..."` executes them as command substitution. Use the Write tool for such files.
- Don't call `python3` from the Windows-side Git Bash: it resolves to the Microsoft Store stub and hangs until the tool timeout. Use the Edit tool, `sed`, or run Python inside WSL.
- Tailwind's preflight sets `svg { display: block }`. Icons that sit inside running text (e.g. the external-link arrow in `AppLink`) need `inline` plus a vertical alignment class, or they wrap onto their own line.
- MDX case-study visuals (code themes, diagrams, tables) aren't covered by jsdom. Check them in a real build: render a throwaway `src/app/mdx-smoke/` route, screenshot it, then delete it and run `npx next typegen`.
- Dynamic routes under Cache Components: `dynamicParams` is rejected, and `notFound()` after the shell has streamed leaves a `200`. Unknown slugs are filtered in `src/proxy.ts` before rendering. When adding another dynamic route with a known set of params, extend the proxy (and its test) rather than relying on `notFound()` alone.
- `wsl.exe -d Ubuntu -- bash -ic '...'` loses `$var` / `$!` expansions in some invocations. For anything with shell variables or loops, write a script file and run `bash <file>` instead.
- Tests that need Node APIs (e.g. `NextRequest` for the proxy) declare `// @vitest-environment node` at the top. `vitest.setup.ts` only stubs browser globals when `window` exists.
- Shiki's `github-light` theme fails WCAG AA (orange tokens are 3.48:1 on white). Use `github-light-default`. Axe in `e2e/projects.spec.ts` checks real case-study code, so a theme change that breaks contrast fails the e2e run.
- Anything that scrolls horizontally must be focusable (axe `scrollable-region-focusable`). Wrap it in `ScrollArea` rather than a bare `overflow-x-auto` div.
- `next dev` validates instant navigation on every route and warns when `params`/`searchParams` are read outside `<Suspense>` (`instant-shell-url-data`). Keep the page component synchronous and move param-dependent work into a child inside `<Suspense>` (see `src/app/projects/[slug]/page.tsx`). These warnings only appear in dev: check by running a separate `next dev -p 3300`, visiting the route directly and via client navigation, and reading the server log and browser console.
- `BASE_URL` switches Playwright to an existing deployment and disables its `webServer`. Keep `@smoke` tests deployment-agnostic: no content assumptions beyond what `src/content` exports, no local-only state. They run against the container, Vercel previews and production.
- The same TLS-intercepting proxy blocks Docker image pulls (Docker Hub's CloudFront and GHCR blob hosts), while manifests still resolve (`docker buildx imagetools inspect` works). On that network, `docker build`, `npm run docker:smoke` and the linter images can't run. Verify from another network or in CI. GitHub release downloads do work, so run actionlint, shellcheck and hadolint locally from their release binaries (e.g. in `/tmp`), and put shellcheck on `PATH` so actionlint checks `run:` scripts too.
- CI pins actions by full commit SHA with a `# vX.Y.Z` comment, and linter images by digest. When adding an action, resolve the SHA with `git ls-remote https://github.com/<owner>/<repo> 'refs/tags/<tag>^{}'` (fall back to the tag ref itself for lightweight tags). Never use a moving tag.
- Docker: `.dockerignore` is an **allowlist**. A new root config the build needs (e.g. `postcss.config.mjs`) must be allowed there. The runtime stage doesn't copy `public/` because the folder doesn't exist yet; add `COPY --from=build /app/public ./public` when it does.
- `output: "standalone"` is enabled only with `BUILD_STANDALONE=1` (Dockerfile). Don't make it unconditional: `next start` (Playwright's server) doesn't support it.
- `NavLink` sets `aria-current="page"` on exact matches and `"true"` on child pages of its section. E2E tests asserting nav state must pick the right value.
