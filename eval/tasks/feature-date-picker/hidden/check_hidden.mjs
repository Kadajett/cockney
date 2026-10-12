// Hidden check for feature-date-picker. Exit 0 = pass.
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exit(1); };
const html = readFileSync('signup.html', 'utf8');

function attrs(tag) {
  const out = {};
  const inner = tag.replace(/^<\s*[\w-]+/, '').replace(/\/?>$/, '');
  for (const m of inner.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}

const form = html.match(/<form\b[^>]*>([\s\S]*?)<\/form>/i);
if (!form) fail('no <form> in signup.html');
const formBody = form[1];

const dobTag = [...formBody.matchAll(/<input\b[^>]*>/gi)].map((m) => m[0])
  .find((t) => { const a = attrs(t); return (a.type || '').toLowerCase() === 'date' && a.name === 'dob'; });
if (!dobTag) fail('no <input type="date" name="dob"> inside the signup form');
const dob = attrs(dobTag);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const labelledByFor = dob.id && new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*["']?${esc(dob.id)}["'\\s>]`, 'i').test(formBody);
const wrapped = [...formBody.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)].some((m) => m[1].includes(dobTag));
if (!labelledByFor && !wrapped) fail('dob input has no associated <label> (for=id or wrapping)');

// 13+ enforcement: a max attribute on the input, or script code that handles dob and the age 13.
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
const jsFiles = readdirSync('.').filter((f) => /\.(m?js)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
const scripts = `${inlineScripts}\n${jsFiles}`;
const hasMax = 'max' in dob;
const jsEnforces = /\bdob\b/.test(scripts) && /\b13\b/.test(scripts);
if (!hasMax && !jsEnforces) fail('nothing enforces the 13+ minimum age (no max attribute, no dob validation in script)');

// No CDN / remote code.
const remote = /^(?:https?:)?\/\//i;
for (const m of html.matchAll(/<script\b[^>]*>/gi)) {
  const a = attrs(m[0]);
  if (a.src && remote.test(a.src)) fail(`remote script include: ${a.src}`);
}
for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
  const a = attrs(m[0]);
  if (a.href && remote.test(a.href)) fail(`remote stylesheet/link: ${a.href}`);
}
if (/\bimport\b[^;]*?["'](?:https?:)?\/\//.test(scripts)) fail('remote ES module import');

// No new dependencies.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
  if (pkg[key] && Object.keys(pkg[key]).length) fail(`package.json ${key} changed: ${Object.keys(pkg[key]).join(', ')}`);
}
if (existsSync('node_modules')) fail('node_modules/ was created');

console.log('PASS');
