# Animated Delivery Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the repeated About-section portrait with a responsive, accessible, five-stage animated delivery architecture.

**Architecture:** Keep the diagram semantic by rendering the five stages as an ordered HTML list, with an inline SVG used only for decorative connections. CSS owns the 10-second visual sequence and theme-aware presentation; a small controller in `site-animations.js` starts the sequence near the viewport and pauses it while the tab is hidden.

**Tech Stack:** Semantic HTML, responsive CSS, inline SVG, vanilla JavaScript, IntersectionObserver, Node.js built-in test runner, html-validate.

## Global Constraints

- The hero remains the only large portrait presentation.
- Use this exact sequence: Business Need → Data & Backend → Automation & AI → QA & Validation → Reliable Outcome.
- Use a 520px minimum desktop card height and a 610px minimum height at or below 680px.
- Run one 10-second repeating cycle with a maximum node translation of 3px.
- Inactive animated nodes must remain at 72% opacity or higher.
- Do not add cursor-following behavior to the About card.
- Use green only for the final outcome state.
- Preserve readable static content without JavaScript and under reduced motion.
- Add no runtime dependency.

## File Structure

- Modify `tests/portfolio.test.mjs`: add contracts for portrait removal, stage order, semantics, themes, motion, and progressive enhancement.
- Modify `index.html`: replace the About photo markup and styles with the architecture card.
- Modify `site-animations.js`: add visibility-aware `.is-flowing` state management before the existing GSAP guard.

---

### Task 1: Semantic Architecture Card and Animation

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html`
- Modify: `site-animations.js`

**Interfaces:**
- Consumes: existing `--surface`, `--line`, `--primary`, `--cyan`, `--green`, `--text`, and `--muted` variables.
- Produces: `.architecture-card`, `.architecture-nodes`, `.architecture-node`, `.architecture-connectors`, and the `.is-flowing` runtime state.

- [ ] **Step 1: Write the failing architecture tests**

Add these contracts to `tests/portfolio.test.mjs`:

```js
test('about section replaces the repeated portrait with a semantic delivery architecture', () => {
  const about = html.slice(html.indexOf('id="about"'), html.indexOf('id="results"'));
  assert.doesNotMatch(about, /<img\b/i);
  assert.match(about, /<div[^>]+class="architecture-card reveal"/i);
  assert.match(about, /<ol[^>]+class="architecture-nodes"[^>]+aria-label="Delivery architecture stages"/i);
  assert.match(about, /<svg[^>]+class="architecture-connectors"[^>]+aria-hidden="true"/i);

  const stages = [
    'Business Need',
    'Data &amp; Backend',
    'Automation &amp; AI',
    'QA &amp; Validation',
    'Reliable Outcome'
  ];
  let previous = -1;
  for (const stage of stages) {
    const position = about.indexOf(stage);
    assert.ok(position > previous, `${stage} is missing or out of order`);
    previous = position;
  }
});

test('delivery architecture animation is theme-aware and progressively enhanced', () => {
  assert.match(html, /--architecture-line:\s*rgba\(/);
  assert.match(html, /html\.bright-mode\s*\{[\s\S]*?--architecture-line:\s*rgba\(/);
  assert.match(html, /\.architecture-card\.is-flowing[\s\S]*?10s linear infinite/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.architecture-signal[\s\S]*?animation:\s*none/);
  assert.ok(animations.includes('IntersectionObserver'));
  assert.ok(animations.includes("visibilitychange"));
  assert.ok(animations.includes("is-flowing"));
  assert.ok(animations.indexOf('setupArchitectureFlow') < animations.indexOf('if (!window.gsap) return'));
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test --test-name-pattern="delivery architecture" tests/portfolio.test.mjs`

Expected: FAIL because the About section still contains the repeated image and has no architecture markup or controller.

- [ ] **Step 3: Replace the About photo markup**

Replace `.about-photo` with this semantic card:

```html
<div class="architecture-card reveal" aria-labelledby="architectureTitle">
  <span class="architecture-grid" aria-hidden="true"></span>
  <div class="architecture-header">
    <div>
      <span class="architecture-kicker"><span class="architecture-status-dot" aria-hidden="true"></span> Delivery Architecture</span>
      <h3 id="architectureTitle">How I Build Reliable Systems</h3>
    </div>
    <span class="architecture-live">Live Flow</span>
  </div>
  <div class="architecture-flow">
    <svg class="architecture-connectors" viewBox="0 0 440 390" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path class="architecture-track" pathLength="1" d="M74 37 C74 78 366 61 366 104 S74 135 74 178 S366 210 366 252 S220 310 220 352"/>
      <path class="architecture-signal" pathLength="1" d="M74 37 C74 78 366 61 366 104 S74 135 74 178 S366 210 366 252 S220 310 220 352"/>
    </svg>
    <ol class="architecture-nodes" aria-label="Delivery architecture stages">
      <li class="architecture-node" style="--stage: 0s">
        <span class="architecture-code">01</span><span><strong>Business Need</strong><small>Goals · Users · Rules</small></span><span class="architecture-chip">DISCOVER</span>
      </li>
      <li class="architecture-node" style="--stage: 2s">
        <span class="architecture-code">02</span><span><strong>Data &amp; Backend</strong><small>Oracle · SQL · APIs</small></span><span class="architecture-chip">DESIGN</span>
      </li>
      <li class="architecture-node" style="--stage: 4s">
        <span class="architecture-code">03</span><span><strong>Automation &amp; AI</strong><small>AWS · Python · Assisted workflows</small></span><span class="architecture-chip">BUILD</span>
      </li>
      <li class="architecture-node" style="--stage: 6s">
        <span class="architecture-code">04</span><span><strong>QA &amp; Validation</strong><small>Cypress · Reconciliation · Monitoring</small></span><span class="architecture-chip">VERIFY</span>
      </li>
      <li class="architecture-node architecture-outcome" style="--stage: 8s">
        <span class="architecture-code">05</span><span><strong>Reliable Outcome</strong><small>Faster · Observable · Supportable</small></span><span class="architecture-chip">DELIVER</span>
      </li>
    </ol>
  </div>
</div>
```

- [ ] **Step 4: Replace the photo CSS with the architecture CSS**

Remove `.about-photo`, `.about-photo img`, `.about-photo::after`, and `.photo-caption` rules. Add `.architecture-card` to the shared card selector and add:

```css
:root {
  --architecture-line: rgba(73, 215, 255, 0.25);
  --architecture-soft: rgba(45, 140, 255, 0.12);
  --architecture-glow: rgba(73, 215, 255, 0.16);
}

html.bright-mode {
  --architecture-line: rgba(0, 112, 208, 0.3);
  --architecture-soft: rgba(8, 121, 223, 0.09);
  --architecture-glow: rgba(8, 121, 223, 0.11);
}

.architecture-card {
  position: relative;
  min-height: 520px;
  padding: 26px;
  overflow: hidden;
  border-radius: 28px;
  isolation: isolate;
}

.architecture-grid {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px), radial-gradient(circle at 70% 38%, var(--architecture-glow), transparent 44%);
  background-size: 38px 38px, 38px 38px, auto;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.72), transparent 94%);
  opacity: 0.32;
}

.architecture-header {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.architecture-kicker,
.architecture-live {
  color: var(--cyan);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.architecture-status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 5px rgba(86, 230, 165, 0.08);
}

.architecture-header h3 {
  margin: 8px 0 0;
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  letter-spacing: -0.035em;
}

.architecture-live {
  padding: 7px 9px;
  border: 1px solid var(--architecture-line);
  border-radius: 999px;
  background: var(--architecture-soft);
  white-space: nowrap;
}

.architecture-flow {
  position: relative;
  min-height: 390px;
  margin-top: 15px;
}

.architecture-connectors {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.architecture-track,
.architecture-signal {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.architecture-track {
  stroke: var(--architecture-line);
  stroke-width: 1.3;
}

.architecture-signal {
  stroke: var(--cyan);
  stroke-width: 3;
  stroke-dasharray: 0.04 0.96;
  stroke-dashoffset: 0;
  filter: drop-shadow(0 0 7px var(--cyan));
  opacity: 0;
}

.architecture-nodes {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 390px;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
}

.architecture-node {
  width: 78%;
  min-height: 61px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: var(--header);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(16px);
}

.architecture-node:nth-child(even) { align-self: flex-end; }
.architecture-outcome { width: 86%; align-self: center; border-color: color-mix(in srgb, var(--green) 45%, transparent); }
.architecture-code { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 11px; background: var(--architecture-soft); color: var(--primary); font-family: "Space Grotesk", sans-serif; font-size: 0.72rem; font-weight: 800; }
.architecture-node strong, .architecture-node small { display: block; }
.architecture-node strong { font-family: "Space Grotesk", sans-serif; font-size: 0.92rem; }
.architecture-node small { margin-top: 2px; overflow: hidden; color: var(--muted); font-size: 0.64rem; text-overflow: ellipsis; white-space: nowrap; }
.architecture-chip { color: var(--muted); font-size: 0.53rem; font-weight: 800; letter-spacing: 0.1em; }
.architecture-outcome .architecture-code, .architecture-outcome .architecture-chip { color: var(--green); }

.architecture-card.is-flowing .architecture-signal { opacity: 1; animation: architecture-route 10s linear infinite; }
.architecture-card.is-flowing .architecture-node { animation: architecture-node-pulse 10s ease-in-out var(--stage) infinite; }
.architecture-card.is-flowing .architecture-status-dot { animation: architecture-status 2s ease-in-out infinite; }

@keyframes architecture-route { to { stroke-dashoffset: -1; } }
@keyframes architecture-node-pulse { 0%, 18%, 100% { opacity: 0.72; transform: translateY(0); } 4%, 14% { opacity: 1; border-color: var(--architecture-line); box-shadow: 0 14px 38px var(--architecture-glow); transform: translateY(-3px); } }
@keyframes architecture-status { 50% { box-shadow: 0 0 0 8px rgba(86, 230, 165, 0); } }
```

Inside the existing `@media (max-width: 680px)` block, replace `.about-photo { min-height: 430px; }` with:

```css
.architecture-card { min-height: 610px; padding: 21px; }
.architecture-header { align-items: flex-start; }
.architecture-live { display: none; }
.architecture-flow, .architecture-nodes { min-height: 465px; }
.architecture-node, .architecture-outcome { width: 92%; }
.architecture-node:nth-child(even) { align-self: flex-end; }
.architecture-node small { white-space: normal; }
.architecture-chip { display: none; }
```

Inside the existing reduced-motion media query, add:

```css
.architecture-signal,
.architecture-card.is-flowing .architecture-signal,
.architecture-card.is-flowing .architecture-node,
.architecture-card.is-flowing .architecture-status-dot {
  animation: none !important;
}

.architecture-node { opacity: 1 !important; transform: none !important; }
.architecture-signal { opacity: 0 !important; }
```

- [ ] **Step 5: Add visibility-aware animation control before the GSAP guard**

At the start of the existing DOMContentLoaded handler in `site-animations.js`, add:

```js
  function setupArchitectureFlow() {
    const card = document.querySelector('.architecture-card');
    if (!card) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let isNearViewport = false;
    function syncFlowState() {
      card.classList.toggle('is-flowing', isNearViewport && !document.hidden);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        isNearViewport = entries.some(function (entry) { return entry.isIntersecting; });
        syncFlowState();
      }, { rootMargin: '120px 0px' });
      observer.observe(card);
    } else {
      isNearViewport = true;
      syncFlowState();
    }

    document.addEventListener('visibilitychange', syncFlowState);
  }

  setupArchitectureFlow();
```

Keep `if (!window.gsap) return;` immediately after that call so the architecture still works without GSAP.

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run: `node --test --test-name-pattern="delivery architecture" tests/portfolio.test.mjs`

Expected: 2 tests pass and all unmatched tests are skipped.

- [ ] **Step 7: Commit the architecture task**

```bash
git add index.html site-animations.js tests/portfolio.test.mjs
git commit -m "feat: replace about portrait with delivery architecture"
```

---

### Task 2: Full Verification and Publication

**Files:**
- Verify: `index.html`
- Verify: `site-animations.js`
- Verify: `machine-background.js`
- Verify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: the completed static portfolio.
- Produces: a validated GitHub change and a verified public About architecture.

- [ ] **Step 1: Run all tests**

Run: `node --test tests/portfolio.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Validate HTML and JavaScript**

Run: `HOME=/tmp NPM_CONFIG_CACHE=/tmp/npm-cache npx --yes html-validate index.html && node --check site-animations.js && node --check machine-background.js`

Expected: exit code 0 with no validation or syntax errors.

- [ ] **Step 3: Check patch hygiene and scope**

Run: `git diff --check && git status -sb`

Expected: no whitespace errors and no uncommitted files.

- [ ] **Step 4: Publish through GitHub**

Create a branch from the current remote `main`, apply the verified spec, plan, `index.html`, `site-animations.js`, and test contents, open a pull request, and squash-merge after confirming it is mergeable.

- [ ] **Step 5: Verify the live page**

Open the GitHub Pages URL with a cache-busting query. Confirm the About section has no image, all five nodes are visible and ordered, the card fits dark and bright themes, the flow receives `.is-flowing` near the viewport, reduced-motion contracts remain present, page width does not exceed viewport width, and no site-origin console errors appear.
