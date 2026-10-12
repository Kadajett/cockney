import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { load, save } from './store.mjs';

const dir = mkdtempSync(join(tmpdir(), 'todo-store-'));

test('save then load round-trips', (t, done) => {
  const file = join(dir, 'todos.json');
  save(file, [{ text: 'milk', done: false }], (err) => {
    assert.ifError(err);
    load(file, (err2, todos) => {
      assert.ifError(err2);
      assert.deepEqual(todos, [{ text: 'milk', done: false }]);
      done();
    });
  });
});

test('load of a missing file errors with ENOENT', (t, done) => {
  load(join(dir, 'nope.json'), (err) => {
    assert.equal(err.code, 'ENOENT');
    done();
  });
});
