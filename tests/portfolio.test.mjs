import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(testDir, '..');
const html = readFileSync(resolve(rootDir, 'index.html'), 'utf8');
const animations = readFileSync(resolve(rootDir, 'site-animations.js'), 'utf8');

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
