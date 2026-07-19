# Animated Tools Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage’s six-item technology strip with a polished two-row, opposite-direction marquee containing Bryan Condino’s CV tool inventory.

**Architecture:** Keep the existing static technology row as the no-JavaScript fallback, then progressively enhance it during `DOMContentLoaded`. `site-animations.js` will generate accessible duplicated marquee lanes and inject component-scoped CSS; no JavaScript frame loop or remote runtime asset is used. Regression tests will verify tool coverage, two lanes, opposite directions, pause behavior, and reduced-motion fallback.

**Tech Stack:** HTML, CSS keyframes, vanilla JavaScript, Node.js test runner.

## Global Constraints

- Change only the homepage technology strip and its supporting animation/test code.
- Keep every unrelated homepage section unchanged.
- Use recognizable local letter/vector-style marks for major tools and monograms for the remainder.
- Do not rely on remote image URLs at runtime.
- Use CSS keyframe animation, approximately 38–48 seconds per desktop cycle.
- Pause on hover and keyboard focus.
- Disable movement and show a readable wrapping layout for `prefers-reduced-motion: reduce`.

---

### Task 1: Add marquee regression contract

**Files:**
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `site-animations.js` source text.
- Produces: Assertions for `setupTechnologyMarquee`, two lane classes, opposite animation names, duplicated `aria-hidden` groups, complete representative tool coverage, pause behavior, and reduced-motion rules.

- [ ] **Step 1:** Add a test that checks the two-lane structure and representative tools from every CV category.
- [ ] **Step 2:** Run `node --test tests/portfolio.test.mjs` and confirm the new contract fails before implementation.
- [ ] **Step 3:** Commit the failing test as `test: define animated tools marquee contract`.

### Task 2: Implement the hybrid two-row marquee

**Files:**
- Modify: `site-animations.js`

**Interfaces:**
- Consumes: `.technology-strip`, `.technology-list`, and CSS variables already defined in `index.html`.
- Produces: `setupTechnologyMarquee()` which creates `.technology-marquee`, `.technology-marquee-lane--forward`, `.technology-marquee-lane--reverse`, duplicated groups with assistive-technology hiding, hybrid icon badges, and CSS-only movement.

- [ ] **Step 1:** Define the full CV inventory across database, scripting, AWS/integration, engineering tools, and delivery environments.
- [ ] **Step 2:** Add recognizable local marks for Oracle, AWS, Python, Git, PostgreSQL, MySQL, Postman, Cypress, and Oracle APEX; generate monograms for other tools.
- [ ] **Step 3:** Split tools across two balanced lanes and duplicate each lane’s group for a seamless loop.
- [ ] **Step 4:** Add opposite-direction CSS animations, edge masks, theme-aware glass badges, hover/focus pause, tablet/mobile sizing, and reduced-motion wrapping fallback.
- [ ] **Step 5:** Call `setupTechnologyMarquee()` before the GSAP early return so the marquee works without GSAP.
- [ ] **Step 6:** Run `node --check site-animations.js` and `node --test tests/portfolio.test.mjs` and confirm both pass.
- [ ] **Step 7:** Commit as `Enhance technology strip with animated CV tool marquee`.

### Task 3: Verify and integrate

**Files:**
- Verify: `site-animations.js`
- Verify: `tests/portfolio.test.mjs`
- Verify: `index.html`

**Interfaces:**
- Consumes: completed feature branch.
- Produces: a fast-forward-safe main branch commit.

- [ ] **Step 1:** Compare `agent/animated-tools-marquee` against `main` and confirm only the approved spec, plan, marquee code, and tests changed.
- [ ] **Step 2:** Run or inspect available repository checks: Node syntax, portfolio tests, HTML validation, and whitespace validation.
- [ ] **Step 3:** Fast-forward `main` to the verified feature branch commit.
- [ ] **Step 4:** Fetch the final commit and confirm the marquee implementation exists on `main`.
