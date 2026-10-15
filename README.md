# adriano.dev — DevOps & Automation Portfolio

Personal portfolio for **Adriano Matoba Lipski**: a professional profile and a small technical lab that explains how code gets from a commit to production. The goal is a site that feels like a well-built developer tool. It favours evidence over claims and never presents simulated data as real.

- Product requirements: [docs/features-specification.md](docs/features-specification.md)
- Visual identity ("Terminal Modern"): [docs/visual-identity.md](docs/visual-identity.md)
- Current feature plan (home page): [docs/homepage-plan.md](docs/homepage-plan.md)
- Rules for contributors and AI agents: [AGENTS.md](AGENTS.md)

## Status

| Area                                                | State                              |
| --------------------------------------------------- | ---------------------------------- |
| Tooling (lint, format, typecheck, unit + e2e tests) | Done                               |
| Design tokens, theme, layout                        | Planned (homepage plan, steps 3–8) |
| Home page `/`                                       | In progress                        |
| `/projects`, `/lab`, `/about`                       | Not started                        |

## Tech stack

| Concern              | Choice                                   | Notes                                                                                            |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Framework            | Next.js 16 (App Router)                  | `cacheComponents` and partial prefetching are enabled. See [Next.js 16 notes](#nextjs-16-notes). |
| Language             | TypeScript (strict)                      | `@/*` is an alias for `src/*`.                                                                   |
| Styling              | Tailwind CSS v4                          | Compiled through `@tailwindcss/turbopack`. Colors only through semantic tokens.                  |
| Theme                | `next-themes`                            | Light/dark, follows the OS on first visit, choice persisted.                                     |
| Motion               | `motion`                                 | Only where it explains a state change; respects reduced motion.                                  |
| Icons                | `lucide-react`                           |                                                                                                  |
| Unit/component tests | Vitest + React Testing Library + jsdom   |                                                                                                  |
| E2E tests            | Playwright + `@axe-core/playwright`      | Runs against a production build on port 3100.                                                    |
| Formatting           | Prettier + `prettier-plugin-tailwindcss` |                                                                                                  |

## Getting started

Prerequisites: **Node.js ≥ 20.9** (developed on Node 24) and npm.

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

| Script                            | What it does                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                     |
| `npm run build` / `npm start`     | Production build and server                                            |
| `npm run lint`                    | ESLint (Next.js core-web-vitals + TypeScript rules)                    |
| `npm run typecheck`               | `tsc --noEmit` (run `npx next typegen` first if routes moved)          |
| `npm run format` / `format:check` | Prettier write / verify                                                |
| `npm test` / `test:watch`         | Vitest unit and component tests                                        |
| `npm run test:e2e`                | Playwright; builds and starts the app automatically                    |
| `npm run check`                   | lint + typecheck + format check + unit tests (run before every commit) |

## Project structure

```text
src/
  app/          routes, root layout, global styles and design tokens
  components/   UI grouped by domain (layout, navigation, theme, pipeline, home, ui, ...)
  content/      typed content: projects, skills, pipeline stages
  lib/          site config and small pure helpers
e2e/            Playwright specs
docs/           specs and feature plans
```

Content (text, links, projects) is kept separate from components, so updating the site usually means editing `src/content/` or `src/lib/site-config.ts` only. The full planned tree is in [docs/homepage-plan.md §3](docs/homepage-plan.md).

## Testing

- **Unit and component tests** sit next to the code they cover (`foo.ts` → `foo.test.ts`) and test behavior through the public interface.
- **End-to-end tests** live in `e2e/`. Playwright runs `npm run build && npm start -p 3100`, with two projects: `desktop-chromium` and `mobile-chromium` (Pixel 7).
- The project follows test-driven development: write a failing test, make it pass, repeat.

## Contributing

1. Read [AGENTS.md](AGENTS.md) for conventions: TDD, KISS, minimal comments, tokens-only colors, content as data.
2. Make sure `npm run check` passes. Also run `npm run build` and `npm run test:e2e` when routes or rendering change.
3. Keep this README and the relevant `docs/` files up to date in the same change.

## Next.js 16 notes

- **Cache Components:** reading the current time or a random value while rendering fails prerendering. Use a `'use cache'` function or `connection()`.
- **Activity:** routes you navigate away from stay mounted but hidden. Transient UI must reset itself, and tests must use visibility-aware locators.
- The bundled docs in `node_modules/next/dist/docs/` are the reference for this version.

## Known limitations

- Content (links, projects, skills) is not final. It's tracked with `TODO(content)` markers.
