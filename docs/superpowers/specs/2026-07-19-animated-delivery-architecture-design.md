# Animated Delivery Architecture Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Replace the repeated portrait in the About section with a professional animated architecture that explains how Bryan Condino turns a business need into a reliable technical outcome. The hero remains the only large portrait presentation.

## Placement and Layout

- Replace the complete `.about-photo` card, including `profile-photo2.png` and the photo caption.
- Preserve the existing two-column About layout and the current copy card.
- Use a new `.architecture-card` with a minimum desktop height of 520px and the existing 28px card radius.
- On screens at or below 680px, use a vertical architecture layout with a minimum height of 610px.
- Keep all architecture content inside the card without horizontal overflow at a 320px viewport.

## Architecture Story

The diagram communicates one continuous five-stage delivery flow:

1. **Business Need** — Goals, users, rules
2. **Data & Backend** — Oracle, SQL, APIs
3. **Automation & AI** — AWS, Python, assisted workflows
4. **QA & Validation** — Cypress, reconciliation, monitoring
5. **Reliable Outcome** — Faster, observable, supportable

The labels must remain visible as real HTML text so the architecture is understandable without animation.

## Visual Design

- Card header: `Delivery Architecture` kicker, `How I Build Reliable Systems` title, and a small `Live Flow` status indicator.
- Use five compact glass-surface nodes with stage numbers `01` through `05`.
- Use blue and cyan for data movement, green only for the final reliable-outcome state, and existing theme variables for text, surfaces, and borders.
- Place a faint circuit-grid layer and restrained radial glow behind the nodes.
- Draw connector paths in a decorative inline SVG behind the HTML nodes.
- Keep the visual density below the surrounding text card so the diagram supports rather than competes with the section heading.

## Motion

- Run one 10-second repeating delivery cycle.
- Move a small glowing packet through the connector path from stage 01 to stage 05.
- Highlight each node in sequence using border color, glow, and a maximum 3px upward translation.
- Keep all labels continuously readable; inactive nodes may dim only to 72% opacity.
- Pause the cycle while the browser tab is hidden and resume without creating duplicate loops.
- Do not add another cursor-following effect; the page already has the global cursor-reactive machine background.

## Accessibility and Progressive Enhancement

- Represent the stages as an ordered list with an accessible label describing the delivery architecture.
- Mark the SVG connectors, packets, and decorative grid as `aria-hidden="true"`.
- If JavaScript is unavailable, show all five nodes and the complete static architecture.
- When `prefers-reduced-motion: reduce` is active, disable packet and node animations and show every node at full opacity with no transforms.
- Animation must not receive focus or interfere with keyboard, pointer, or touch interaction.

## Theme Behavior

- Dark mode uses restrained cyan/blue lines and low-opacity glow on the existing navy background.
- Bright mode uses darker blue/cyan connector colors with lower glow opacity.
- The final outcome node uses the existing `--green` variable in both modes.
- Theme switching through the hero portrait must update the architecture automatically through CSS variables.

## Code Boundaries

- `index.html` owns the semantic architecture markup, card styles, theme variables, responsive layout, and reduced-motion rules.
- `site-animations.js` owns only the visibility-aware addition and removal of an `.is-flowing` class on the architecture card.
- `tests/portfolio.test.mjs` records the absence of the repeated About portrait, the exact five-stage sequence, semantic list structure, SVG decoration, theme styling, motion timing, visibility handling, and reduced-motion fallback.

## Failure Handling

- If `IntersectionObserver` is unavailable, add `.is-flowing` immediately so the CSS animation still works.
- If the tab becomes hidden, remove `.is-flowing`; when it becomes visible, restore the class only when the architecture card is in or near the viewport.
- The site must remain complete and readable if GSAP, IntersectionObserver, or the architecture animation is unavailable.

## Verification

- Add a failing regression test before implementation and observe the expected failure.
- Run the complete Node test suite.
- Validate `index.html` with html-validate.
- Syntax-check `site-animations.js` and `machine-background.js`.
- Run `git diff --check`.
- Verify the live About section in dark and bright modes, confirm the duplicate portrait is absent, confirm the five nodes remain readable, and check for horizontal overflow and site-origin console errors.
