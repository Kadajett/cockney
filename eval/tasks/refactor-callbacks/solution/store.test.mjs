import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { load, save } from './store.mjs';

const dir = mkdtempSync(join(tmpdir(), 'todo-store-'));

test('save then load round-trips', async () => {
  const file = join(dir, 'todos.json');
  await save(file, [{ text: 'milk', done: false }]);
  assert.deepEqual(await load(file), [{ text: 'milk', done: false }]);
});

test('load of a missing file rejects with ENOENT', async () => {
  await assert.rejects(load(join(dir, 'nope.json')), { code: 'ENOENT' });
});
