import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const animations = readFileSync(resolve(testDir, '..', 'site-animations.js'), 'utf8');

test('technology strip becomes an accessible three-row circular logo showcase', () => {
  assert.ok(animations.includes('setupTechnologyMarquee'));
  assert.equal((animations.match(/renderLane\(/g) || []).length >= 4, true);
  assert.ok(animations.includes('technology-marquee-lane--forward'));
  assert.ok(animations.includes('technology-marquee-lane--reverse'));
  assert.ok(animations.includes('technology-marquee-lane--slow'));
  assert.ok(animations.includes('technology-marquee-forward'));
  assert.ok(animations.includes('technology-marquee-reverse'));
  assert.ok(animations.includes('aria-hidden="true"'));
  assert.ok(animations.includes('renderLogo'));
  assert.ok(animations.includes('<svg class="technology-marquee-logo"'));
  assert.ok(!animations.includes('cdn.simpleicons.org'));
  assert.ok(animations.includes('technology-marquee-card'));
  assert.ok(animations.includes('technology-marquee-logo--wide'));
  assert.ok(animations.includes('technology-marquee-logo--compact'));

  for (const tool of [
    'Oracle', 'ChatGPT', 'Claude', 'DeepSeek', 'GitHub Copilot', 'n8n',
    'Supabase', 'Vercel', 'Resend', 'Firebase', 'AWS', 'VS Code', 'GitHub',
    'GitLab', 'Docker', 'Jenkins', 'IntelliJ IDEA', 'MySQL', 'PostgreSQL',
    'Python', 'Git', 'Jira', 'Sublime Text', 'Postman', 'Selenium', 'Cypress',
    'CircleCI', 'Confluence', 'Linux', 'Windows', 'Oracle APEX'
  ]) {
    assert.ok(animations.includes(`'${tool}'`), `missing ${tool}`);
  }

  assert.ok(animations.includes(':hover .technology-marquee-track'));
  assert.ok(animations.includes(':focus-within .technology-marquee-track'));
  assert.ok(animations.includes('@media(prefers-reduced-motion:reduce)'));
  assert.ok(animations.indexOf('setupTechnologyMarquee()') < animations.indexOf('if (!window.gsap) return'));
});
