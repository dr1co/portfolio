# Pre-publish checklist

Everything the home page needs from the owner before it goes public. Each item points to the file to edit. List any content still unreviewed with `grep -rn "TODO(content)" src`.

## Content

- [x] **Links** — GitHub, LinkedIn and email are set in [src/lib/site-config.ts](../src/lib/site-config.ts). The header GitHub icon, "Contact" nav item, Contact section, footer icons and the hero's "Get in touch" button are live.
- [ ] **Intro and hero tags** — review `intro` and `heroTags` in `site-config.ts`.
- [ ] **Skills** — review [src/content/skills.ts](../src/content/skills.ts). Only list technologies you can discuss, and check the `learning` flags.
- [ ] **Projects** — two projects are in [src/content/projects.ts](../src/content/projects.ts) (Django template, thesis). Review each `summary`, `description`, `status` and `technologies` before launch.
- [x] **Django template description** — reworded to make clear it is a generic template derived from client work. Confirm the wording.
- [ ] **Pipeline copy** — review the stage text in [src/content/pipeline.ts](../src/content/pipeline.ts) for accuracy.
- [ ] **Projects page intro** — review `directoryIntro` in [src/content/projects.ts](../src/content/projects.ts).
- [ ] **Thesis technologies** — the repo README lists TensorFlow/Keras (plus Keras Tuner, pandas, scikit-learn) but not PyTorch. Remove `pytorch` from the thesis entry if it was not used.
- [ ] **Thesis description** — drafted from the repo README (including its negative result). Confirm the wording.
- [ ] **Thesis case study** — [src/content/case-studies/tcc-engsoftware.mdx](../src/content/case-studies/tcc-engsoftware.mdx) is a placeholder; the full draft comes in projects-plan Step 7 and needs your review.
- [x] **Source link** — `sourceRepoUrl` is set. Make sure the repository is actually public before launch, or the footer link 404s.
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
