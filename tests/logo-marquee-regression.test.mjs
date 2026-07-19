import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const animations = readFileSync(resolve(testDir, '..', 'site-animations.js'), 'utf8');

test('technology marquee uses local inline SVG logos and includes the expanded toolset', () => {
  assert.doesNotMatch(animations, /cdn\.simpleicons\.org/);
  assert.doesNotMatch(animations, /https?:\/\/[^'"`]+\.svg/);
  assert.match(animations, /<svg[^>]+technology-marquee-logo/);
  assert.match(animations, /renderLogo/);

  for (const tool of [
    'Oracle', 'ChatGPT', 'Claude', 'DeepSeek', 'GitHub Copilot', 'n8n',
    'Supabase', 'Vercel', 'Resend', 'Firebase', 'VS Code', 'GitHub',
    'GitLab', 'Docker', 'Jenkins', 'IntelliJ IDEA', 'Jira', 'Sublime Text',
    'Postman', 'Selenium', 'AWS', 'MySQL', 'PostgreSQL', 'Python', 'Git',
    'Cypress', 'CircleCI', 'Confluence', 'Linux', 'Windows'
  ]) {
    assert.ok(animations.includes(`'${tool}'`), `missing ${tool}`);
  }
});
