# Case Study Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain Case Studies preview art with topic-specific sci-fi mini dashboards while preserving every card’s content, link, responsiveness, and accessibility.

**Architecture:** Keep the existing semantic card markup as the source of truth and progressively enhance each `.case-visual` from `site-animations.js`. The script injects one shared stylesheet and replaces only the decorative `.case-art` contents, so the large homepage HTML remains stable and all cards still work without JavaScript.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Upgrade all Case Studies cards.
- Give Reporting the richest analytics dashboard preview.
- Use no canvas, WebGL, or new dependency for these card previews.
- Preserve existing card text, links, and CTAs.
- Respect `prefers-reduced-motion: reduce`.
- Keep mobile layouts readable and free of horizontal overflow.

---

### Task 1: Add Regression Coverage

**Files:**
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `site-animations.js` source.
- Produces: contracts for `setupCaseStudyVisuals`, all five visual types, reduced-motion support, and the shared preview stylesheet.

- [ ] Add a test asserting that `site-animations.js` contains `setupCaseStudyVisuals`, `case-dashboard`, `case-query`, `case-pipeline`, `case-ai-flow`, and `case-test-suite`.
- [ ] Assert the setup runs before the GSAP guard and includes `prefers-reduced-motion: reduce`.
- [ ] Run the focused test and confirm it fails before implementation.

### Task 2: Implement Shared Case Study Previews

**Files:**
- Modify: `site-animations.js`

**Interfaces:**
- Consumes: `.case-card`, `.case-visual`, `.case-art`, and each card heading.
- Produces: one injected style block and five topic-specific decorative preview templates.

- [ ] Add `setupCaseStudyVisuals()` before the current GSAP guard.
- [ ] Inject shared glass-panel, grid, glow, responsive, animation, and reduced-motion styles once.
- [ ] Replace the Reporting placeholder with KPI tiles, line/bar charts, status rows, and a scanner.
- [ ] Replace Database Performance with latency, query, and before/after modules.
- [ ] Replace AWS Automation with an event pipeline and moving packet.
- [ ] Replace AI Workflows with prompt, process, validation, and output nodes.
- [ ] Replace QA Automation with suite progress, pass rows, coverage, and result summary.
- [ ] Keep all inserted preview markup `aria-hidden="true"`.

### Task 3: Verify and Publish

**Files:**
- Verify: `site-animations.js`
- Verify: `tests/portfolio.test.mjs`

- [ ] Run `node --test tests/*.test.mjs` and require zero failures.
- [ ] Run `node --check site-animations.js` and `node --check machine-background.js`.
- [ ] Review the branch diff for scope and whitespace.
- [ ] Merge the verified branch into `main`.
