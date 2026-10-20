# Pre-publish checklist

Everything the home page needs from the owner before it goes public. Each item points to the file to edit. List any content still unreviewed with `grep -rn "TODO(content)" src`.

## Content

- [ ] **Links** — fill `links.github`, `links.linkedin` and `links.email` in [src/lib/site-config.ts](../src/lib/site-config.ts), or leave any you won't publish empty (empty links are never rendered).
  - Once set: the header GitHub icon, the "Contact" nav item, the Contact section, the footer icons and the hero's "Get in touch" / "Open GitHub" buttons appear automatically.
  - Then update `e2e/home.spec.ts` ("primary action…", "hides sections…") and enable the `test.fixme` in `e2e/mobile.spec.ts`.
- [ ] **Intro and hero tags** — review `intro` and `heroTags` in `site-config.ts`.
- [ ] **Skills** — review [src/content/skills.ts](../src/content/skills.ts). Only list technologies you can discuss, and check the `learning` flags.
- [ ] **Projects** — add real public repositories to [src/content/projects.ts](../src/content/projects.ts) with honest `status` values and `featured: true`. Then flip the `#projects` expectation in `e2e/home.spec.ts`.
- [ ] **Pipeline copy** — review the stage text in [src/content/pipeline.ts](../src/content/pipeline.ts) for accuracy.
- [ ] **Source link** — set `sourceRepoUrl` in `site-config.ts` if this repository is public.
- [ ] `grep -rn "TODO(content)" src` returns nothing.

## Deployment configuration

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin (canonical URL and absolute OG URLs).
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` **only** on the production deployment.

## Safety

- [ ] Nothing employer-owned, internal hostnames, registry paths or secrets appear anywhere (code, content, screenshots).

## Final QA (production build, both themes)

- [ ] Widths 360, 414, 768, 1024, 1440, 1920: no horizontal scroll, the hero heading never overflows, terminal panels scroll internally.
- [ ] Keyboard only: skip link → header → hero buttons → pipeline tabs (arrows, Home/End) → workflow excerpt → copy button → footer. Focus is always visible.
- [ ] Reduced motion (OS setting): no movement, no cursor blink, no smooth scroll.
- [ ] JavaScript disabled: every section is readable, and the pipeline falls back to a static list.
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility 100, Best Practices ≥ 95. SEO flags `noindex` until indexing is enabled, which is expected.
- [ ] Screen reader spot check: h1 → h2 per section → h3 per card or stage; the pipeline announces "tab, 1 of 5, selected".
- [ ] `npm run check`, `npm run build` and `npm run test:e2e` pass.
