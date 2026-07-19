import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(testDir, '..');
const html = readFileSync(resolve(rootDir, 'index.html'), 'utf8');
const animations = readFileSync(resolve(rootDir, 'site-animations.js'), 'utf8');
const favicon = readFileSync(resolve(rootDir, 'favicon.svg'), 'utf8');
const machinePath = resolve(rootDir, 'machine-background.js');
const machine = existsSync(machinePath) ? readFileSync(machinePath, 'utf8') : '';

test('homepage follows the approved results-first section order', () => {
  const ids = [
    'hero',
    'about',
    'results',
    'case-studies',
    'process',
    'services',
    'work-style',
    'faq',
    'contact'
  ];

  let previousPosition = -1;
  for (const id of ids) {
    const position = html.indexOf(`id="${id}"`);
    assert.notEqual(position, -1, `missing #${id}`);
    assert.ok(position > previousPosition, `#${id} is out of order`);
    previousPosition = position;
  }
});

test('homepage exposes its primary destinations and contact routes', () => {
  const destinations = [
    'href="reports.html"',
    'href="ai.html"',
    'href="https://www.linkedin.com/in/bryanCondino"',
    'href="https://github.com/brycondino"',
    'href="mailto:bchengcondino@gmail.com"'
  ];

  for (const destination of destinations) {
    assert.match(html, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('homepage presents the approved measurable outcomes', () => {
  for (const metric of ['10+', '40%', '70%', '99.9%']) {
    assert.ok(html.includes(metric), `missing ${metric} result`);
  }

  assert.match(html, /I turn complex data into reliable systems/i);
});

test('navigation, FAQ, and mobile controls use accessible native elements', () => {
  assert.match(html, /<button[^>]+id="menuToggle"[^>]+aria-expanded="false"/i);
  assert.match(html, /<nav[^>]+id="primaryNav"[^>]+aria-label="Primary navigation"/i);
  assert.match(html, /<section[^>]+id="faq"[\s\S]*?<details/i);
  assert.match(html, /<summary>[^<]+<\/summary>/i);
  assert.match(html, /<main[^>]+id="main-content"/i);
});

test('photo-driven theme switching remains persistent and visible at load', () => {
  assert.match(html, /id="themeToggle"[^>]+aria-label="[^"]+"/i);
  assert.match(html, /id="profilePhoto"[^>]+src="profile-photo\.jpg"/i);
  assert.ok(html.includes('profile-photo2.png'));
  assert.ok(html.includes('portfolioTheme'));
  assert.doesNotMatch(html, /\.hero-visual\s*\{[^}]*opacity\s*:\s*0/i);
});

test('motion is progressive enhancement with reduced-motion protection', () => {
  assert.match(html, /src="site-animations\.js\?v=20260719-results"/);
  assert.ok(animations.includes("prefers-reduced-motion: reduce"));
  assert.ok(animations.includes('.hero-copy'));
  assert.ok(animations.includes('.hero-visual'));
  assert.ok(animations.includes('.reveal'));
  assert.ok(animations.includes('.metric-value'));
});

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

test('homepage integrates a decorative futuristic machine layer', () => {
  assert.match(html, /<canvas[^>]+id="machineBackground"[^>]+class="machine-background"[^>]+aria-hidden="true"/i);
  assert.match(html, /\.machine-background\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?pointer-events:\s*none;/);
  assert.match(html, /src="machine-background\.js\?v=20260719-professional"/);
});

test('machine motion is subtle, responsive, and progressively enhanced', () => {
  assert.ok(machine.includes('prefers-reduced-motion: reduce'));
  assert.ok(machine.includes('(pointer: coarse)'));
  assert.ok(machine.includes('pointermove'));
  assert.ok(machine.includes('requestAnimationFrame'));
  assert.ok(machine.includes('visibilitychange'));
  assert.match(machine, /Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/);
  assert.match(machine, /current\.x \+= \(target\.x - current\.x\) \* 0\.045/);
});
