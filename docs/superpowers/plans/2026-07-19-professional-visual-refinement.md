# Professional Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio typography and portrait more proportional, replace the favicon with a readable BC mark, and add a subtle cursor-reactive futuristic machine behind the page.

**Architecture:** Keep the existing single-page HTML/CSS structure and isolate the new canvas behavior in `machine-background.js`. The homepage supplies one decorative canvas and theme-aware CSS, while the new script owns rendering, pointer interpolation, resize, visibility, and motion-preference behavior. Existing GSAP motion remains untouched.

**Tech Stack:** Semantic HTML, CSS custom properties and responsive media queries, SVG, Canvas 2D API, vanilla JavaScript, Node.js built-in test runner, html-validate.

## Global Constraints

- Set the desktop hero heading to `clamp(3rem, 5vw, 4.5rem)`.
- Set primary section headings to `clamp(2.25rem, 4vw, 3.5rem)`.
- Cap contact headings at 4.5rem and case-study headings at 3rem.
- Set metric values to `clamp(2.75rem, 4vw, 3.8rem)`.
- Set the narrow-mobile hero heading to `clamp(2.4rem, 11vw, 3.5rem)`.
- Keep primary body copy at or above 0.95rem.
- Set the hero portrait button to 330px desktop and 240px narrow mobile.
- Keep the machine decorative, non-interactive, low-opacity, touch-safe, and reduced-motion safe.
- Add no runtime dependency.

## File Structure

- Modify `tests/portfolio.test.mjs`: add contract coverage for visual scale, favicon identity, canvas integration, and progressive enhancement.
- Modify `index.html`: adjust the typography and portrait scale; add machine colors, layering, canvas markup, and a cache-busted script reference.
- Modify `favicon.svg`: replace the abstract mark with a readable BC monogram.
- Create `machine-background.js`: own all futuristic canvas rendering and input/lifecycle behavior.

---

### Task 1: Professional Typography, Portrait, and BC Favicon

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html`
- Modify: `favicon.svg`

**Interfaces:**
- Consumes: existing homepage CSS selectors and `favicon.svg` link.
- Produces: exact typography and portrait limits plus a favicon whose SVG source contains the visible text `BC`.

- [ ] **Step 1: Write the failing visual-scale and favicon tests**

Add the favicon fixture and contracts:

```js
const favicon = readFileSync(resolve(rootDir, 'favicon.svg'), 'utf8');

test('homepage uses a restrained professional type and portrait scale', () => {
  assert.match(html, /h1\s*\{[\s\S]*?font-size:\s*clamp\(3rem, 5vw, 4\.5rem\)/);
  assert.match(html, /\.section-heading h2\s*\{[\s\S]*?font-size:\s*clamp\(2\.25rem, 4vw, 3\.5rem\)/);
  assert.match(html, /\.metric-value\s*\{[\s\S]*?font-size:\s*clamp\(2\.75rem, 4vw, 3\.8rem\)/);
  assert.match(html, /\.portrait-button\s*\{[\s\S]*?width:\s*min\(330px, 86%\)/);
  assert.match(html, /@media \(max-width:\s*680px\)[\s\S]*?h1\s*\{[\s\S]*?clamp\(2\.4rem, 11vw, 3\.5rem\)/);
  assert.match(html, /@media \(max-width:\s*680px\)[\s\S]*?\.portrait-button\s*\{[\s\S]*?width:\s*min\(240px, 78%\)/);
});

test('favicon is a readable BC monogram', () => {
  assert.match(favicon, /<text[^>]*>BC<\/text>/);
  assert.match(favicon, /<rect[^>]+rx="28"/);
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test --test-name-pattern="professional type|BC monogram" tests/portfolio.test.mjs`

Expected: FAIL because the current scale is larger and the favicon does not contain the BC monogram.

- [ ] **Step 3: Apply the exact CSS scale**

Change the relevant declarations in `index.html`:

```css
h1 { font-size: clamp(3rem, 5vw, 4.5rem); }
.portrait-button { width: min(330px, 86%); }
.section-heading h2,
.faq-intro h2 { font-size: clamp(2.25rem, 4vw, 3.5rem); }
.metric-value { font-size: clamp(2.75rem, 4vw, 3.8rem); }
.case-number { font-size: 3.6rem; }
.case-content h3 { font-size: clamp(1.7rem, 3vw, 3rem); }
.contact-panel h2 { font-size: clamp(2.6rem, 5vw, 4.5rem); }

@media (max-width: 680px) {
  h1 { font-size: clamp(2.4rem, 11vw, 3.5rem); }
  .portrait-button { width: min(240px, 78%); }
}
```

Reduce the portrait ring offset from `-24px` to `-18px`, reduce `.hero-visual` from 500px to 420px, and reduce floating-result padding and placement offsets to fit the smaller composition without changing their text.

- [ ] **Step 4: Replace `favicon.svg` with the BC monogram**

Use this scalable shape:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="BC">
  <defs>
    <linearGradient id="accent" x1="20" y1="18" x2="108" y2="110" gradientUnits="userSpaceOnUse">
      <stop stop-color="#49d7ff"/>
      <stop offset="1" stop-color="#2d8cff"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="#080b12"/>
  <rect x="7" y="7" width="114" height="114" rx="23" fill="none" stroke="url(#accent)" stroke-width="5"/>
  <text x="64" y="78" text-anchor="middle" fill="url(#accent)" font-family="Inter, Arial, sans-serif" font-size="47" font-weight="800" letter-spacing="-3">BC</text>
</svg>
```

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run: `node --test --test-name-pattern="professional type|BC monogram" tests/portfolio.test.mjs`

Expected: 2 tests pass and all unmatched tests are skipped.

- [ ] **Step 6: Commit the visual-scale task**

```bash
git add index.html favicon.svg tests/portfolio.test.mjs
git commit -m "style: refine portfolio scale and branding"
```

---

### Task 2: Subtle Cursor-Reactive Machine Background

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html`
- Create: `machine-background.js`

**Interfaces:**
- Consumes: `#machineBackground`, `html.bright-mode`, viewport dimensions, pointer coordinates, motion and pointer media queries.
- Produces: a decorative Canvas 2D background whose public DOM contract is `<canvas id="machineBackground" class="machine-background" aria-hidden="true"></canvas>`.

- [ ] **Step 1: Write the failing machine integration tests**

Add the fixture and contracts:

```js
const machine = readFileSync(resolve(rootDir, 'machine-background.js'), 'utf8');

test('homepage integrates a decorative futuristic machine layer', () => {
  assert.match(html, /<canvas[^>]+id="machineBackground"[^>]+class="machine-background"[^>]+aria-hidden="true"/i);
  assert.match(html, /\.machine-background\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?pointer-events:\s*none;/);
  assert.match(html, /src="machine-background\.js\?v=20260719-professional"/);
});

test('machine motion is subtle, responsive, and progressively enhanced', () => {
  assert.ok(machine.includes("prefers-reduced-motion: reduce"));
  assert.ok(machine.includes("(pointer: coarse)"));
  assert.ok(machine.includes("pointermove"));
  assert.ok(machine.includes("requestAnimationFrame"));
  assert.ok(machine.includes("visibilitychange"));
  assert.match(machine, /Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/);
  assert.match(machine, /current\.x \+= \(target\.x - current\.x\) \* 0\.045/);
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test --test-name-pattern="futuristic machine|machine motion" tests/portfolio.test.mjs`

Expected: FAIL because `machine-background.js` and its DOM/CSS integration do not exist.

- [ ] **Step 3: Add the canvas markup, style, and loading contract**

Add after the skip link:

```html
<canvas id="machineBackground" class="machine-background" aria-hidden="true"></canvas>
```

Add the theme-aware layer:

```css
:root {
  --machine-opacity: 0.32;
}

html.bright-mode {
  --machine-opacity: 0.19;
}

.machine-background {
  position: fixed;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: var(--machine-opacity);
  pointer-events: none;
}

main,
.site-footer {
  position: relative;
  z-index: 1;
}
```

Load the script before GSAP:

```html
<script src="machine-background.js?v=20260719-professional"></script>
```

- [ ] **Step 4: Implement the isolated Canvas 2D renderer**

Create `machine-background.js` as an IIFE:

```js
(function () {
  const canvas = document.getElementById('machineBackground');
  const context = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!context) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frameId = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let running = false;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw(performance.now());
  }

  function onPointerMove(event) {
    target.x = event.clientX / width - 0.5;
    target.y = event.clientY / height - 0.5;
  }

  function tick(time) {
    if (!running) return;
    current.x += (target.x - current.x) * 0.045;
    current.y += (target.y - current.y) * 0.045;
    draw(time);
    frameId = window.requestAnimationFrame(tick);
  }

  function getPalette() {
    const bright = document.documentElement.classList.contains('bright-mode');
    return bright ? {
      line: 'rgba(8, 121, 223, 0.22)',
      soft: 'rgba(0, 154, 196, 0.12)',
      glow: 'rgba(8, 121, 223, 0.14)'
    } : {
      line: 'rgba(73, 215, 255, 0.24)',
      soft: 'rgba(45, 140, 255, 0.13)',
      glow: 'rgba(73, 215, 255, 0.16)'
    };
  }

  function strokeArc(radius, start, end, color, lineWidth) {
    context.beginPath();
    context.arc(0, 0, radius, start, end);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  function drawCircuit(radius, palette) {
    const paths = [
      [[-radius * 1.55, -radius * 0.28], [-radius * 0.95, -radius * 0.28], [-radius * 0.72, -radius * 0.5]],
      [[-radius * 1.4, radius * 0.38], [-radius * 1.02, radius * 0.38], [-radius * 0.78, radius * 0.58]]
    ];
    paths.forEach(function (points) {
      context.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) context.moveTo(point[0], point[1]);
        else context.lineTo(point[0], point[1]);
      });
      context.strokeStyle = palette.soft;
      context.lineWidth = 1;
      context.stroke();
      context.beginPath();
      context.arc(points[0][0], points[0][1], 3, 0, Math.PI * 2);
      context.fillStyle = palette.line;
      context.fill();
    });
  }

  function draw(time) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    const palette = getPalette();
    const radius = Math.max(150, Math.min(330, Math.min(width, height) * 0.33));
    const centerX = width * 0.78 + current.x * 18;
    const centerY = height * 0.48 + current.y * 12;
    const rotation = time * 0.00004;

    context.save();
    context.translate(centerX, centerY);
    context.shadowColor = palette.glow;
    context.shadowBlur = 16;
    drawCircuit(radius, palette);

    [0.35, 0.52, 0.7, 0.88, 1].forEach(function (scale, index) {
      const direction = index % 2 ? -1 : 1;
      const offset = rotation * direction * (index + 1);
      strokeArc(radius * scale, offset, offset + Math.PI * (1.15 + index * 0.08), index % 2 ? palette.soft : palette.line, index === 0 ? 1.5 : 1);
      strokeArc(radius * scale, offset + Math.PI * 1.35, offset + Math.PI * 1.72, palette.soft, 1);
    });

    for (let index = 0; index < 8; index += 1) {
      const angle = index * Math.PI / 4 - rotation * 1.8;
      const nodeRadius = radius * (index % 2 ? 0.7 : 0.84);
      const x = Math.cos(angle) * nodeRadius;
      const y = Math.sin(angle) * nodeRadius;
      context.beginPath();
      context.moveTo(Math.cos(angle) * radius * 0.38, Math.sin(angle) * radius * 0.38);
      context.lineTo(x, y);
      context.strokeStyle = palette.soft;
      context.stroke();
      context.beginPath();
      context.arc(x, y, 2.5 + Math.sin(time * 0.0015 + index) * 0.7, 0, Math.PI * 2);
      context.fillStyle = palette.line;
      context.fill();
    }

    context.beginPath();
    context.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
    context.fillStyle = palette.glow;
    context.fill();
    context.restore();
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    frameId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(frameId);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (!coarsePointer && !reduceMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });
  new MutationObserver(function () {
    if (reduceMotion) draw(0);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  if (!reduceMotion) start();
}());
```

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run: `node --test --test-name-pattern="futuristic machine|machine motion" tests/portfolio.test.mjs`

Expected: 2 tests pass and all unmatched tests are skipped.

- [ ] **Step 6: Commit the machine task**

```bash
git add index.html machine-background.js tests/portfolio.test.mjs
git commit -m "feat: add subtle reactive machine background"
```

---

### Task 3: Full Verification and Deployment Readiness

**Files:**
- Verify: `index.html`
- Verify: `favicon.svg`
- Verify: `machine-background.js`
- Verify: `site-animations.js`
- Verify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: the complete static portfolio.
- Produces: a clean, validated branch ready for GitHub publication.

- [ ] **Step 1: Run the complete contract suite**

Run: `node --test tests/portfolio.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Validate markup**

Run: `HOME=/tmp NPM_CONFIG_CACHE=/tmp/npm-cache npx --yes html-validate index.html`

Expected: exit code 0 with no HTML validation errors.

- [ ] **Step 3: Syntax-check both JavaScript assets**

Run: `node --check machine-background.js && node --check site-animations.js`

Expected: exit code 0 and no output.

- [ ] **Step 4: Check patch hygiene and repository scope**

Run: `git diff --check && git status -sb && git diff --stat HEAD~2..HEAD`

Expected: no whitespace errors and only the approved spec, plan, homepage, favicon, machine script, and test changes in scope.

- [ ] **Step 5: Publish through GitHub**

Create a feature branch based on the current remote `main`, apply the verified file contents, open a pull request, merge it after checks, and retain the PR URL and merge commit for the handoff.

- [ ] **Step 6: Verify the deployed page**

Open `https://brycondino.github.io/brycondino/` with a cache-busting query string. Confirm the reduced heading and portrait sizes, BC favicon link, machine canvas dimensions, subtle pointer response, dark/bright theme compatibility, no horizontal overflow, and no site-origin console warnings.
