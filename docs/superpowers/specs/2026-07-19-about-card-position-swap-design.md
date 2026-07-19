# About Card Position Swap Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Switch the two cards in the About section so the existing text card is on the left and the existing animated delivery architecture is on the right.

## Layout

- Move `.about-copy` before `.architecture-card` in the HTML.
- Reverse the desktop column proportions from `0.86fr 1.14fr` to `1.14fr 0.86fr` so each card keeps its current visual width after switching sides.
- Preserve the current card content, styling, height, animation, spacing, and theme behavior.
- At widths where the About section becomes one column, keep the semantic order: text card first, architecture card second.

## Accessibility

- Use DOM order rather than CSS `order` so visual, keyboard, and screen-reader reading order remain aligned.
- Preserve the architecture group label and ordered delivery stages.

## Verification

- Add a regression assertion that `.about-copy` appears before `.architecture-card` inside `#about`.
- Run the complete portfolio tests, HTML validation, JavaScript syntax checks, and whitespace checks.
- Verify the deployed desktop page shows text left and architecture right without overflow.
