# Professional Visual Refinement Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Refine Bryan Condino's results-first portfolio so the typography and portrait feel more proportional, the favicon clearly represents the initials BC, and the page gains subtle futuristic depth without reducing readability or performance.

## Visual Direction

The portfolio remains professional, evidence-led, dark-first, and blue-accented. The refinement should feel quieter and more deliberate than the current version. The animated background is ambient infrastructure, not a focal illustration.

## Typography

- Set the desktop hero heading to `clamp(3rem, 5vw, 4.5rem)`.
- Set the primary section headings to `clamp(2.25rem, 4vw, 3.5rem)`.
- Cap oversized contact headings at 4.5rem and case-study headings at 3rem.
- Set metric values to `clamp(2.75rem, 4vw, 3.8rem)` while preserving their hierarchy.
- Set the narrow-mobile hero heading to `clamp(2.4rem, 11vw, 3.5rem)`.
- Keep body copy at accessible reading sizes; do not reduce primary paragraphs below 0.95rem.
- Preserve Space Grotesk for headings and Inter for interface and body text.

## Portrait

- Reduce the hero portrait button from 430px to 330px on desktop.
- Reduce it to 240px on narrow mobile screens.
- Keep the circular crop, theme-switching behavior, orbit detail, floating result cards, and visible loading state.
- Reduce orbit and floating-card offsets so the composition remains balanced around the smaller portrait.

## BC Favicon

- Replace the abstract mark with an SVG rounded square containing readable uppercase “BC” initials.
- Use the existing dark navy background with a restrained blue-to-cyan accent.
- Avoid fine decorative details that disappear at 16px and 32px browser-tab sizes.
- Keep the SVG favicon path and MIME declaration unchanged.

## Cursor-Reactive Futuristic Machine

### Rendering

- Add one fixed, full-viewport canvas behind all page content.
- Draw a low-opacity technical machine composed of concentric rings, segmented arcs, circuit paths, nodes, and restrained blue/cyan glow.
- Position the primary mechanical assembly toward the right side of the viewport so it supports the hero composition without sitting directly behind key text.
- Allow a secondary faint circuit field to extend into the page background for continuity.

### Motion

- Apply slow continuous ring rotation and gentle node pulsing.
- Smoothly interpolate the machine a small distance toward the cursor; cursor movement must create depth rather than direct object tracking.
- Cap device-pixel-ratio rendering to protect performance.
- Pause rendering when the tab is hidden.
- Do not attach cursor tracking on coarse-pointer or touch-first devices.
- When `prefers-reduced-motion: reduce` is active, render one static frame and do not run the animation loop.

### Layering and Readability

- Mark the canvas as decorative with `aria-hidden="true"`.
- Keep it non-interactive with `pointer-events: none`.
- Place it above the page base background but below the header and all content.
- Keep opacity low enough that paragraphs, cards, and buttons retain their existing contrast.
- Adjust machine color and opacity for bright mode so it remains subtle in both themes.

## Code Boundaries

- `index.html` owns typography, portrait sizing, canvas markup, theme-aware colors, and loading order.
- A new `machine-background.js` module owns canvas sizing, drawing, input tracking, visibility handling, and reduced-motion behavior.
- `site-animations.js` remains responsible for GSAP entrance and scroll motion only.
- `favicon.svg` owns the BC browser-tab mark.
- `tests/portfolio.test.mjs` records the visual contracts and progressive-enhancement safeguards.

## Failure Handling

- If canvas 2D context is unavailable, the script exits without affecting the page.
- If JavaScript is disabled, the existing background and all portfolio content remain complete and usable.
- Resize handling must rebuild geometry without creating duplicate listeners or animation loops.

## Verification

- Add contract tests for the reduced typography limits, smaller portrait sizes, BC favicon text, decorative canvas, cache-busted machine script, reduced-motion branch, touch-pointer guard, and cursor interpolation.
- Run the complete Node test suite.
- Validate `index.html` with html-validate.
- Syntax-check both JavaScript files.
- Run `git diff --check`.
- Verify the live desktop page, theme switching, cursor response, no horizontal overflow, and absence of site-origin console errors after deployment.
