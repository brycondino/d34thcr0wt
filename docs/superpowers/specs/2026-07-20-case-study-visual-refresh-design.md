# Case Study Visual Refresh Design

**Date:** 2026-07-20  
**Status:** Approved

## Goal

Improve the visual impact of the Case Studies section so the project cards feel more polished, more premium, and more obviously tied to Bryan Condino’s backend, reporting, automation, AI, and QA expertise. The reporting card should receive the richest mini-dashboard treatment, while the rest of the cards should follow the same upgraded visual system for consistency.

## Scope

- Refresh all Case Studies cards, not only the reporting card.
- Keep the current section structure, card ordering, links, and written content intact.
- Preserve the professional sci-fi direction established elsewhere on the site.
- Avoid heavy 3D or WebGL. Use lightweight HTML, CSS, SVG, and vanilla JavaScript only.

## Visual Direction

Use a shared interactive sci-fi dashboard language across all Case Studies cards. Each card keeps the current text and CTA, but its visual panel becomes a purpose-built mini interface with glass surfaces, subtle glow, layered data UI, and restrained motion.

The Reporting card becomes the richest preview with KPI tiles, line and bar charts, live labels, and a subtle scanner. Database Performance uses a query/latency interface, AWS Automation uses a flowing event pipeline, AI Workflows uses prompt-processing-validation-output modules, and QA Automation uses test progress, pass indicators, and coverage visualization.

## Interaction and Motion

- Use CSS-first animation.
- Keep movement subtle and low amplitude.
- Add restrained hover depth and border illumination.
- Respect `prefers-reduced-motion: reduce`.
- Simplify visual density on mobile.
- Preserve all existing card links and click behavior.

## Accessibility and Performance

- Treat visual UI chrome as decorative support for the written content.
- Keep keyboard focus and pointer interactions unchanged.
- Use no canvas, WebGL, or new runtime dependency for the card visuals.
- Keep all visuals responsive and prevent horizontal overflow.

## Verification

- Every Case Studies card uses the refreshed preview system.
- The Reporting card clearly reads as an analytics dashboard.
- Other cards have distinct topic-matched visuals.
- Reduced-motion behavior remains present.
- Portfolio tests pass.
- Changed JavaScript passes syntax checks.
- `git diff --check` is clean.
