# Visual Identity — Terminal Modern

**Project:** Adriano's DevOps & Automation Portfolio  
**Document type:** Visual identity and interface design system  
**Status:** Initial design specification  
**Primary language:** English

---

## 1. Identity Overview

### 1.1 Core concept

**Terminal Modern** combines the precision of developer tools with the clarity of a modern engineering product.

The visual identity should suggest:

- Technical competence.
- Reliability and operational discipline.
- Automation and repeatability.
- Practical engineering rather than hype.
- Curiosity, experimentation, and continuous improvement.

The site should feel like a thoughtfully designed developer tool, not a terminal emulator stretched into a portfolio.

### 1.2 Brand statement

> From code to production.

Supporting message:

> Building reproducible environments, automated workflows, and reliable software delivery.

These lines are starting points. They should be reviewed against the final professional positioning and the projects actually available.

### 1.3 Personality

| Attribute    | Direction                                        |
| ------------ | ------------------------------------------------ |
| Technical    | Clear, specific, evidence-based                  |
| Modern       | Restrained motion and crisp layouts              |
| Reliable     | Consistent states and predictable interactions   |
| Approachable | Plain English and helpful explanations           |
| Experimental | Interactive technical demos with safe boundaries |
| Professional | No exaggerated claims or decorative clutter      |

### 1.4 What the identity is not

Avoid:

- Neon green on pure black everywhere.
- “Hacker movie” clichés, skulls, rain effects, and glitch overload.
- Constant typing animations that make content hard to read.
- Fake terminal output presented as real system activity.
- Huge walls of technology logos.
- Fake uptime, deployment, or infrastructure metrics.
- Excessive glassmorphism and glowing borders.
- Tiny monospace text for all content.
- Animations that delay access to important information.

---

## 2. Color System

The site supports dark and light themes. Colors should be defined as semantic tokens so components do not depend on raw color values.

### 2.1 Brand palette

| Token                 | Hex       | Role                                                       |
| --------------------- | --------- | ---------------------------------------------------------- |
| Graphite              | `#11151C` | Dark theme primary background                              |
| Panel                 | `#191F28` | Dark theme elevated surfaces                               |
| Panel Elevated        | `#202834` | Hovered or higher-emphasis dark surfaces                   |
| Border Dark           | `#303945` | Dark theme separators and outlines                         |
| Terminal Green        | `#A3E6A0` | Brand accent, interactive highlights                       |
| Terminal Green Strong | `#6FBF73` | Stronger green for accessible states when contrast permits |
| Soft White            | `#E8EDF0` | Light theme page background                                |
| White                 | `#FFFFFF` | Light theme cards and inputs                               |
| Ink                   | `#18212B` | Light theme primary text                                   |
| Steel                 | `#64748B` | Secondary text and quiet icons                             |
| Slate                 | `#94A3B8` | Dark theme muted text                                      |
| Cyan Accent           | `#66D9E8` | Secondary accent for links or data visualization           |
| Warning               | `#E8B86D` | Warning states                                             |
| Error                 | `#E17C7C` | Error states                                               |
| Info                  | `#7DAFE8` | Informational states                                       |

Do not use all accents at once. Green is the primary brand accent; cyan is secondary and should appear mainly in technical visualizations, selected links, or data distinctions.

### 2.2 Dark theme tokens

Suggested initial mapping:

```css
:root,
[data-theme="dark"] {
  --background: #11151c;
  --surface: #191f28;
  --surface-elevated: #202834;
  --foreground: #e8edf0;
  --muted: #a3afbd;
  --border: #303945;
  --accent: #a3e6a0;
  --accent-foreground: #11151c;
  --accent-secondary: #66d9e8;
  --success: #a3e6a0;
  --warning: #e8b86d;
  --error: #e17c7c;
  --info: #7dafe8;
}
```

### 2.3 Light theme tokens

```css
[data-theme="light"] {
  --background: #e8edf0;
  --surface: #ffffff;
  --surface-elevated: #f5f7f8;
  --foreground: #18212b;
  --muted: #526171;
  --border: #d2dae1;
  --accent: #347a42;
  --accent-foreground: #ffffff;
  --accent-secondary: #087e91;
  --success: #347a42;
  --warning: #875a13;
  --error: #b33e3e;
  --info: #285d9a;
}
```

These are initial design tokens, not a substitute for contrast testing. Adjust them where necessary to meet WCAG AA contrast requirements for the relevant text size and UI state.

### 2.4 Color usage ratios

A useful starting guideline:

- 70–80% background and neutral surfaces.
- 15–25% text, borders, and secondary interface elements.
- 5% or less accent colors.

This is a visual guideline, not a hard constraint.

### 2.5 Semantic states

Use both text/iconography and color to represent state.

| State     | Suggested label       | Visual treatment                         |
| --------- | --------------------- | ---------------------------------------- |
| Success   | Passed / Healthy      | Green accent and check icon              |
| Running   | Running / In progress | Neutral or cyan accent and activity icon |
| Pending   | Pending               | Muted border and clock icon              |
| Warning   | Warning               | Amber accent and warning icon            |
| Failure   | Failed                | Red accent and error icon                |
| Simulated | Demo / Simulated      | Neutral badge with explanatory label     |

Never indicate pipeline success with color alone.

---

## 3. Typography

### 3.1 Font roles

Use a readable sans-serif for most content and a monospaced face for technical details.

Suggested pairing:

- **Primary:** Geist Sans or Inter.
- **Monospace:** Geist Mono or JetBrains Mono.

Use fonts through a reliable local or framework-supported loading mechanism where possible. Avoid blocking page rendering on unnecessary external font requests.

### 3.2 Typography rules

- Headings: sans-serif, medium to bold weight, compact line-height.
- Body: sans-serif, regular weight, comfortable line-height.
- Code, commands, file paths, labels, and terminal panels: monospace.
- Navigation: sans-serif, medium weight; monospace may be used sparingly for a technical flavor.
- Avoid long paragraphs in monospace.
- Avoid small text for essential information.

### 3.3 Suggested type scale

| Token       | Desktop size | Use                                     |
| ----------- | -----------: | --------------------------------------- |
| `text-xs`   |      0.75rem | Metadata, labels, secondary annotations |
| `text-sm`   |     0.875rem | Supporting text and compact UI          |
| `text-base` |         1rem | Default body                            |
| `text-lg`   |     1.125rem | Lead paragraphs and card descriptions   |
| `text-xl`   |      1.25rem | Small section headings                  |
| `text-2xl`  |       1.5rem | Section headings                        |
| `text-3xl`  |     1.875rem | Secondary hero headings                 |
| `text-4xl`  |      2.25rem | Hero heading on small screens           |
| `text-5xl`  |         3rem | Hero heading on larger screens          |

Use responsive scaling and adjust the hero heading to prevent overflow on narrow screens.

### 3.4 Content width

- Main reading width: approximately 65–75 characters per line.
- Long-form case studies: keep paragraphs readable and break technical content into sections.
- Full-width layouts may be used for diagrams and interactive pipeline visualizations.
- Avoid stretching ordinary body text across the entire screen.

---

## 4. Layout and Spacing

### 4.1 Grid

- Use a centered content container.
- Suggested maximum width: 72–80rem for general layouts.
- Use a narrower measure for articles and project narratives.
- Use a responsive grid: one column on mobile, two columns where cards benefit from comparison, and three columns only when the viewport and content justify it.
- Keep gutters consistent.

### 4.2 Spacing scale

Use a consistent spacing scale, preferably aligned with Tailwind's spacing tokens.

Common values:

- `4px` — tiny icon/text gaps.
- `8px` — compact control spacing.
- `12px` — small component padding.
- `16px` — standard gap and padding.
- `24px` — card and section spacing.
- `32px` — larger group spacing.
- `48px` — section separation.
- `64–96px` — major desktop section separation.

Do not force large desktop spacing onto mobile screens.

### 4.3 Surfaces

- Main background: flat neutral color.
- Cards: slightly elevated surface with a subtle border.
- Terminal panels: dark or theme-aware inset surface with clear title bar and content hierarchy.
- Avoid heavy shadows. Prefer border contrast and small elevation changes.
- Use rounded corners consistently, generally in a moderate range rather than pill-shaped containers everywhere.

### 4.4 Borders and separators

- Use thin, low-contrast borders for structure.
- Increase border contrast on focus, selection, or active state.
- Do not outline every element.
- Reserve dotted or dashed borders for meaningful technical diagrams or placeholder states.

---

## 5. Signature Components

### 5.1 Wordmark

Use a simple text-based mark such as `adriano.dev` or initials plus a subtle green terminal cursor. It should remain legible without an image asset.

Avoid creating a complex logo before the site content and identity are stable.

### 5.2 Navigation bar

- Minimal and persistent at the top of the page.
- Wordmark aligned left.
- Main routes aligned right on desktop.
- Theme toggle and external links grouped consistently.
- On mobile, use an accessible menu button with a clear open/close state.
- Active route should be identifiable by more than color alone.

### 5.3 Hero

The hero should use a strong headline, concise supporting text, technology tags, and one or two clear calls to action.

Use technical motifs sparingly:

- A command prompt prefix.
- A thin grid or subtle dot pattern.
- A small pipeline illustration.
- A restrained terminal panel.

Do not put essential text inside a decorative image.

### 5.4 Terminal panel

A terminal panel is a **presentation component**, not an unrestricted command interface.

Design:

- Panel header with context label, e.g. `pipeline-demo / main`.
- Small status marker.
- Command or configuration snippet in monospace.
- Output area with readable line spacing.
- Clear `Demo` or `Simulated` label when output is not real.
- Optional copy button for static code snippets, with accessible feedback.

No arbitrary command execution from the browser.

### 5.5 Pipeline nodes

Each node should communicate:

- Stage name.
- Icon.
- Current state.
- Selection state.
- Optional connector to the next stage.

Interaction:

- Hover: subtle surface/border change.
- Keyboard focus: visible outline.
- Selected: accent border plus label/state.
- Running: limited animation that stops when reduced motion is requested.
- Failure: readable error label and icon.

On mobile, pipeline stages may wrap, scroll horizontally with accessible controls, or become a vertical sequence. Prefer a vertical sequence if horizontal scrolling harms discoverability.

### 5.6 Project cards

Each card should include:

- Title.
- One concise sentence.
- Three to five relevant technology labels at most.
- Accurate project status.
- Clear links to details and source code, where available.

Cards should not depend on hover to reveal important information.

### 5.7 Architecture diagrams

- Use consistent node shapes and arrow styles.
- Label relationships and data flow.
- Use icons only when they clarify meaning.
- Provide a textual explanation or accessible alternative.
- Ensure diagrams remain understandable in both themes.
- Do not expose internal employer architecture.

---

## 6. Motion and Microinteractions

### 6.1 Motion philosophy

Motion should explain state changes, hierarchy, or relationships. It should never be required to understand the page.

### 6.2 Suitable effects

- Short fade/translate entrance for non-critical sections.
- Subtle card lift or border change on hover.
- Smooth selection transition in pipeline nodes.
- Animated connector progression in a simulated pipeline.
- Small theme-toggle transition.
- Expand/collapse animation for technical details.

### 6.3 Timing guidelines

Initial targets:

- Small interaction: 120–180ms.
- Standard transition: 180–280ms.
- Larger section transition: 250–400ms.

These are guidelines, not mandatory values. Avoid delaying navigation or access to content.

### 6.4 Reduced motion

Respect `prefers-reduced-motion`. When reduced motion is requested:

- Remove non-essential movement.
- Avoid auto-playing pipeline sequences.
- Replace moving progress indicators with static status labels.
- Keep all information and interactions available.

### 6.5 Typing effects

Typing animation may be used in a small decorative label, but not for essential descriptions or navigation. Do not make visitors wait for a sentence to finish before they can read it.

---

## 7. Icons and Technical Imagery

- Use one consistent icon family, such as Lucide.
- Icons should supplement text, not replace it for critical controls.
- Avoid mixing emoji, multiple icon packs, and unrelated illustration styles throughout the interface.
- Use official technology logos selectively in project metadata.
- Prefer real project diagrams and screenshots over generic stock imagery.
- Add meaningful alternative text to informative images.
- Keep decorative assets out of the accessibility tree when appropriate.

---

## 8. Responsive Behavior

### 8.1 Mobile

- Single-column reading flow.
- Comfortable touch targets.
- No essential hover-only content.
- Avoid terminal panels wider than the viewport.
- Allow code blocks to scroll horizontally without causing the whole page to overflow.
- Collapse navigation into an accessible menu.
- Stack pipeline stages vertically if necessary.
- Reduce decorative grid density and animation.

### 8.2 Tablet

- Use two-column layouts where they improve scanning.
- Keep hero copy readable.
- Avoid cramped multi-column technology lists.
- Ensure navigation has enough space for the theme toggle.

### 8.3 Desktop

- Use a clear content container and consistent grid.
- Allow diagrams and pipeline visualizations more width.
- Keep project descriptions within readable line lengths.
- Use empty space intentionally rather than filling every region with cards.

### 8.4 Testing widths

At minimum, inspect narrow mobile, larger mobile, tablet, laptop, and wide desktop viewports. Test actual content, long project names, and code blocks—not just empty placeholder cards.

---

## 9. Accessibility and Contrast

Target WCAG 2.2 AA where applicable.

- Test contrast for body text, small labels, buttons, borders, and focus indicators.
- Do not rely on color alone for state.
- Provide accessible labels for icon-only controls.
- Ensure interactive elements are keyboard reachable.
- Use semantic HTML and correct heading order.
- Respect reduced-motion preferences.
- Ensure theme changes do not make code or diagrams unreadable.
- Keep error and success states understandable without color.
- Avoid rapid flashing or continuously moving decorative content.

The palette values are starting points. Contrast must be tested in actual component contexts before release.

---

## 10. Content and Voice

The writing style should be direct, practical, and technically precise.

Prefer:

- “Built a containerized Django environment with reproducible local setup.”
- “Automated linting, tests, and image publishing with GitHub Actions.”
- “This interactive pipeline is a simulation; it does not trigger a real deployment.”

Avoid:

- Unsupported claims such as “expert in all cloud platforms”.
- Generic filler such as “passionate ninja rockstar”.
- Presenting planned features as completed.
- Claiming production readiness without documenting what was tested.
- Publishing company-specific details or proprietary configuration.

### 10.1 Project language

Use a consistent vocabulary:

- **Implemented** — exists and has been tested.
- **Demonstration** — a limited example of a concept.
- **Simulated** — represents behavior without running the real system.
- **Planned** — not implemented yet.
- **Currently learning** — active learning area, not a claim of professional mastery.

---

## 11. Theme Switching

- Default to the operating system preference on first visit.
- Provide an explicit theme control.
- Persist manual choice where practical.
- Avoid a flash of the wrong theme.
- Keep layout and content stable when the theme changes.
- Use semantic tokens instead of hard-coded colors in individual components.
- Verify the full site in both themes, including diagrams, syntax highlighting, badges, disabled controls, and focus states.

The theme toggle should be accessible by keyboard and expose its current action/state through an appropriate accessible label.

---

## 12. Design Tokens and Implementation Guidance

Keep the design system centralized. Suggested semantic tokens:

```css
:root {
  color-scheme: light;
  --background: #e8edf0;
  --surface: #ffffff;
  --surface-elevated: #f5f7f8;
  --foreground: #18212b;
  --muted: #526171;
  --border: #d2dae1;
  --accent: #347a42;
  --accent-foreground: #ffffff;
  --accent-secondary: #087e91;
  --success: #347a42;
  --warning: #875a13;
  --error: #b33e3e;
  --info: #285d9a;
}

[data-theme="dark"] {
  color-scheme: dark;
  --background: #11151c;
  --surface: #191f28;
  --surface-elevated: #202834;
  --foreground: #e8edf0;
  --muted: #a3afbd;
  --border: #303945;
  --accent: #a3e6a0;
  --accent-foreground: #11151c;
  --accent-secondary: #66d9e8;
  --success: #a3e6a0;
  --warning: #e8b86d;
  --error: #e17c7c;
  --info: #7dafe8;
}
```

Map these variables to Tailwind utilities or component styles. Do not scatter repeated hex codes throughout the application.

---

## 13. Brand Consistency Checklist

Before releasing a new page or component, confirm:

- [ ] It uses the shared color and spacing tokens.
- [ ] Typography follows the defined roles.
- [ ] It works in dark and light themes.
- [ ] It is usable by keyboard and touch.
- [ ] It supports reduced motion.
- [ ] State is communicated by text/iconography as well as color.
- [ ] It remains readable on mobile.
- [ ] Animations have a clear purpose.
- [ ] Technical claims and status indicators are truthful.
- [ ] It does not expose private infrastructure or employer-owned information.
- [ ] It matches the same visual language as the rest of the site.

---

## 14. Design Acceptance Criteria

The identity is considered implemented when:

- All pages use a coherent, centralized design token system.
- Dark and light themes both pass visual review.
- The hero and pipeline preview establish the Terminal Modern identity without overwhelming the content.
- Project cards and technical case studies share consistent visual patterns.
- The UI remains readable without animation.
- Responsive layouts work at mobile, tablet, and desktop widths.
- Interactive elements have clear focus, hover, active, disabled, and error states where relevant.
- Contrast and accessibility have been checked in actual components.
- No decorative element is more prominent than the portfolio's evidence of engineering work.

The goal is not to make every element look like a terminal. The goal is to make the whole experience feel precise, dependable, and built by an engineer who values clarity.
