# Results-First Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage with a results-first, recruiter-friendly portfolio that follows the reference site's information hierarchy while preserving Bryan's content, project pages, and persistent photo-driven theme switch.

**Architecture:** Keep the dependency-light GitHub Pages architecture. `index.html` owns semantic content, responsive styles, navigation, theme switching, resume discovery, and FAQ disclosure; `site-animations.js` supplies optional GSAP enhancement; a Node built-in test checks the static page contract without introducing a package manager.

**Tech Stack:** Semantic HTML5, modern CSS, vanilla JavaScript, GSAP 3.12.5 from CDN, Node.js built-in test runner.

## Global Constraints

- Preserve `ai.html`, `reports.html`, both profile photos, favicon assets, and automatic resume discovery.
- Keep the photo visible immediately and use it as the persistent bright/dark theme control.
- Do not copy branding, text, claims, or assets from adstrategistchris.com.
- Do not fabricate testimonials, employers, clients, or project outcomes.
- The page must work without GSAP and respect `prefers-reduced-motion`.
- Desktop, tablet, and mobile layouts must remain usable.

---

### Task 1: Add the homepage contract test

**Files:**
- Create: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `index.html` and `site-animations.js` as UTF-8 text.
- Produces: a repeatable `node --test tests/portfolio.test.mjs` verification command.

- [ ] **Step 1: Write the failing structural tests**

Create tests using `node:test`, `node:assert/strict`, and `readFileSync` that assert ordered section IDs `hero`, `about`, `results`, `case-studies`, `process`, `services`, `work-style`, `faq`, and `contact`; links to `reports.html`, `ai.html`, LinkedIn, GitHub, and email; the four approved metrics; native FAQ details; and a mobile menu control.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/portfolio.test.mjs`

Expected: failure because the existing homepage does not contain the required results-first sections and controls.

- [ ] **Step 3: Add theme and animation contract tests**

Assert that `portfolioTheme`, `profile-photo.jpg`, `profile-photo2.png`, the accessible `themeToggle`, `prefers-reduced-motion`, and no-JavaScript-safe visibility behavior remain present.

- [ ] **Step 4: Run tests and confirm the expected failure remains structural**

Run: `node --test tests/portfolio.test.mjs`

Expected: failure messages identify missing new homepage behavior rather than test syntax errors.

### Task 2: Rebuild the semantic homepage

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: existing image assets, `site-animations.js`, `ai.html`, `reports.html`, GitHub profile, LinkedIn profile, email address, and resume discovery folders.
- Produces: section anchors, `.reveal` elements, `.metric-card` elements, `.case-card` links, `#themeToggle`, `#profilePhoto`, and `#menuToggle` for behavior and animation.

- [ ] **Step 1: Implement the fixed header and accessible mobile navigation**

Add Bryan's circular avatar, name and role, links to the approved sections, a Contact Me action, and a native button that toggles the mobile navigation with `aria-expanded`.

- [ ] **Step 2: Implement the outcome-focused hero**

Add the approved headline, supporting paragraph, View Case Studies and Contact Me buttons, large circular portrait, and the four approved achievement callouts. Ensure the portrait has explicit dimensions/aspect ratio and never starts hidden.

- [ ] **Step 3: Implement technology, about, and results sections**

Use semantic sections and cards with the approved content, technologies, and measurable results.

- [ ] **Step 4: Implement the five case studies**

Make each case-study card fully clickable where a valid target exists. Link the reporting and AI demonstrations to their existing pages; use anchored contact actions for consulting-oriented studies.

- [ ] **Step 5: Implement process, services, and How I Work sections**

Use numbered process cards, service cards, and professional-principle cards without testimonials or unsupported claims.

- [ ] **Step 6: Implement FAQ, contact, and footer**

Use native details/summary elements, email/LinkedIn/GitHub/resume actions, and a footer with relevant navigation.

- [ ] **Step 7: Implement persistent theme, photo swap, menu, and resume behavior**

Apply the saved theme before rendering, swap portrait sources with fallbacks, persist `portfolioTheme`, close the mobile menu after navigation, and retain automatic resume link resolution.

- [ ] **Step 8: Run contract tests to verify GREEN**

Run: `node --test tests/portfolio.test.mjs`

Expected: all homepage contract tests pass.

### Task 3: Align motion with the new structure

**Files:**
- Modify: `site-animations.js`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `.site-header`, `.hero-copy`, `.hero-visual`, `.reveal`, `.metric-value`, and GSAP/ScrollTrigger globals.
- Produces: progressive enhancement only; it never controls initial content visibility.

- [ ] **Step 1: Extend the test to require new selectors and reduced-motion guard**

Assert the animation file contains the new homepage selector contracts and `prefers-reduced-motion: reduce`.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/portfolio.test.mjs`

Expected: the animation selector test fails against the old script.

- [ ] **Step 3: Replace homepage-specific animation selectors**

Animate the header, hero copy, visual panel, reveal cards, and metric values with short transforms and opacity transitions. Preserve generic selectors used by `ai.html` and `reports.html` so those pages do not regress.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/portfolio.test.mjs`

Expected: all tests pass.

### Task 4: Browser and repository verification

**Files:**
- Modify only if verification exposes a defect: `index.html`, `site-animations.js`, `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: local static server and browser at desktop/mobile viewport sizes.
- Produces: verified visual layout and final Git commit ready for GitHub.

- [ ] **Step 1: Start a local static server**

Run: `python3 -m http.server 4173`

Expected: server listens on port 4173 and serves the portfolio root.

- [ ] **Step 2: Verify desktop behavior**

Check profile visibility at load, section order, theme/photo switching, navigation, FAQ disclosure, project links, and browser console.

- [ ] **Step 3: Verify mobile behavior**

Check the mobile menu, portrait placement, button sizing, card stacking, horizontal overflow, and all critical calls to action.

- [ ] **Step 4: Run final automated checks**

Run: `node --test tests/portfolio.test.mjs && git diff --check && git status --short`

Expected: tests pass, no whitespace errors, and only intended files are modified.

- [ ] **Step 5: Commit the verified implementation**

Run: `git add index.html site-animations.js tests/portfolio.test.mjs docs/superpowers && git commit -m "feat: redesign portfolio around measurable results"`

Expected: one implementation commit on `codex/results-first-portfolio` after the design/plan commit.
