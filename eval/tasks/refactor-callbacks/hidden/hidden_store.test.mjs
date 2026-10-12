import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { load, save } from './store.mjs';

const isPromise = (v) => v != null && typeof v.then === 'function';
const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
const fresh = () => mkdtempSync(join(tmpdir(), 'hidden-store-'));

test('save returns a promise and writes pretty JSON atomically', async () => {
  const dir = fresh();
  const file = join(dir, 'todos.json');
  const result = save(file, [{ text: 'milk', done: false }]);
  assert.ok(isPromise(result), 'save() must return a promise');
  await result;
  assert.equal(readFileSync(file, 'utf8'), '[\n  {\n    "text": "milk",\n    "done": false\n  }\n]\n');
  assert.deepEqual(readdirSync(dir), ['todos.json'], 'no temp file left behind');
});

test('load returns a promise and round-trips', async () => {
  const file = join(fresh(), 'todos.json');
  const data = [{ text: 'eggs', done: true }, { text: 'Zoë’s birthday', done: false }];
  await save(file, data);
  const result = load(file);
  assert.ok(isPromise(result), 'load() must return a promise');
  assert.deepEqual(await result, data);
});

test('save overwrites an existing file', async () => {
  const file = join(fresh(), 'todos.json');
  await save(file, [{ text: 'a', done: false }]);
  await save(file, []);
  assert.deepEqual(await load(file), []);
});

test('load of a missing file rejects with ENOENT', async () => {
  await assert.rejects(load(join(fresh(), 'missing.json')), { code: 'ENOENT' });
});

test('load of invalid JSON rejects with SyntaxError', async () => {
  const file = join(fresh(), 'broken.json');
  writeFileSync(file, '{not json');
  await assert.rejects(load(file), SyntaxError);
});

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 10000 });
}

test('cli add / done / list still work', () => {
  const file = join(fresh(), 'todos.json');
  let r = run(file, 'list');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, '');
  assert.equal(run(file, 'add', 'buy', 'milk').status, 0);
  assert.equal(run(file, 'add', 'call', 'mum').status, 0);
  r = run(file, 'done', '1');
  assert.equal(r.status, 0, r.stderr);
  r = run(file, 'list');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, '1. [x] buy milk\n2. [ ] call mum\n');
  assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), [
    { text: 'buy milk', done: true },
    { text: 'call mum', done: false },
  ]);
});

test('cli reports errors with a non-zero exit', () => {
  const dir = fresh();
  const file = join(dir, 'todos.json');
  let r = run(file, 'done', '3');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /no todo #3/);
  r = run(file, 'frobnicate');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown command/);
  const broken = join(dir, 'broken.json');
  writeFileSync(broken, '{not json');
  r = run(broken, 'list');
  assert.equal(r.status, 1);
});
