import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const animations = readFileSync(resolve(testDir, '..', 'site-animations.js'), 'utf8');

test('technology strip becomes an accessible two-lane logo marquee', () => {
  assert.ok(animations.includes('setupTechnologyMarquee'));
  assert.ok(animations.includes('technology-marquee-lane--forward'));
  assert.ok(animations.includes('technology-marquee-lane--reverse'));
  assert.ok(animations.includes('technology-marquee-forward'));
  assert.ok(animations.includes('technology-marquee-reverse'));
  assert.ok(animations.includes('aria-hidden="true"'));
  assert.ok(animations.includes('cdn.simpleicons.org'));
  assert.ok(animations.includes('<img class="technology-marquee-logo"'));
  assert.ok(animations.includes('onerror="this.closest'));

  for (const tool of [
    'ChatGPT', 'Claude', 'DeepSeek', 'GitHub Copilot', 'n8n', 'Supabase',
    'Vercel', 'Resend', 'Firebase', 'Oracle', 'Oracle APEX', 'AWS',
    'MySQL', 'PostgreSQL', 'Python', 'Git', 'GitHub', 'Jira', 'Postman',
    'Cypress', 'CircleCI', 'Confluence', 'Linux', 'Windows'
  ]) {
    assert.ok(animations.includes(tool), `missing ${tool}`);
  }

  for (const removedTool of [
    'PL/SQL', 'TOAD for Oracle', 'Data Modelling', 'Data Lineage',
    'Workflow Automation', 'Scrum', 'SDLC', 'WinSCP'
  ]) {
    assert.ok(!animations.includes(`['${removedTool}'`), `unexpected text-only tool ${removedTool}`);
  }

  assert.ok(animations.includes(':hover .technology-marquee-track'));
  assert.ok(animations.includes(':focus-within .technology-marquee-track'));
  assert.ok(animations.includes('@media(prefers-reduced-motion:reduce)'));
  assert.ok(animations.indexOf('setupTechnologyMarquee()') < animations.indexOf('if (!window.gsap) return'));
});
