# About Card Position Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the About text card on the left and the animated delivery architecture on the right while preserving their current visual proportions.

**Architecture:** Reorder the two semantic HTML card elements and reverse the desktop grid fractions. The existing single-column breakpoint will then naturally show text before architecture on smaller screens.

**Tech Stack:** Semantic HTML, CSS Grid, Node.js built-in test runner, html-validate.

## Global Constraints

- Preserve all card content, styling, animation, spacing, and theme behavior.
- Keep DOM order aligned with visual and assistive-technology reading order.
- Keep the current one-column responsive breakpoint.
- Add no runtime dependency.

---

### Task 1: Swap About Card Positions

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.about-grid`, `.about-copy`, and `.architecture-card`.
- Produces: text-first About DOM order and `1.14fr 0.86fr` desktop columns.

- [ ] **Step 1: Add a failing position regression test**

Inside the existing About architecture test, add:

```js
const copyPosition = about.indexOf('class="about-copy reveal"');
const architecturePosition = about.indexOf('class="architecture-card reveal"');
assert.ok(copyPosition >= 0, 'About copy card is missing');
assert.ok(architecturePosition > copyPosition, 'About copy must appear before the architecture');
assert.match(html, /\.about-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1\.14fr\) minmax\(0, 0\.86fr\)/);
```

- [ ] **Step 2: Verify the position test fails**

Run: `node --test --test-name-pattern="about section replaces" tests/portfolio.test.mjs`

Expected: FAIL because the architecture currently appears first and the grid fractions are reversed.

- [ ] **Step 3: Implement the semantic swap**

Change the desktop grid rule to:

```css
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.14fr) minmax(0, 0.86fr);
  align-items: stretch;
  gap: 22px;
}
```

Move the complete `.about-copy` element before the complete `.architecture-card` element inside `.about-grid`. Do not change either card's internal markup.

- [ ] **Step 4: Verify the focused and full suites**

Run:

```bash
node --test --test-name-pattern="about section replaces" tests/portfolio.test.mjs
node --test tests/*.test.mjs
HOME=/tmp NPM_CONFIG_CACHE=/tmp/npm-cache npx --yes html-validate index.html
node --check site-animations.js
node --check machine-background.js
git diff --check
```

Expected: all commands exit 0 and all 12 tests pass.

- [ ] **Step 5: Commit and publish**

```bash
git add index.html tests/portfolio.test.mjs
git commit -m "fix: switch about card positions"
```

Create a GitHub branch from `main`, apply the design, plan, `index.html`, and test changes, open a pull request, verify its patch, and squash-merge it. Confirm the live desktop About section has text left and architecture right with no overflow.
