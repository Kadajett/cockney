import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson, HttpError } from './client.mjs';

// Fake upstream: each step is an HTTP status or an Error to throw; the last step repeats.
function upstream(...steps) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    const step = steps[Math.min(calls.length - 1, steps.length - 1)];
    if (step instanceof Error) throw step;
    return { ok: step >= 200 && step < 300, status: step, json: async () => ({ status: step, attempt: calls.length }) };
  };
  const naps = [];
  const sleep = async (ms) => { naps.push(ms); };
  return { fetch, sleep, calls, naps };
}

const URL_ = 'https://inventory.internal/api/items/A1';
const isHttp = (status) => (err) => err instanceof HttpError && err.status === status;

test('503 then 200 succeeds', async () => {
  const u = upstream(503, 200);
  assert.deepEqual(await fetchJson(URL_, u), { status: 200, attempt: 2 });
  assert.equal(u.calls.length, 2);
  assert.ok(u.naps.length >= 1, 'backs off via the injected sleep');
  assert.ok(u.naps.every((ms) => ms <= 5000), `backoff should be short, got ${u.naps}`);
  assert.equal(u.calls[1].init.headers.accept, 'application/json');
});

test('two 503s then 200 succeeds', async () => {
  const u = upstream(503, 503, 200);
  assert.deepEqual(await fetchJson(URL_, u), { status: 200, attempt: 3 });
  assert.equal(u.calls.length, 3);
});

test('persistent 503 gives up with the 503 error', async () => {
  const u = upstream(503);
  await assert.rejects(fetchJson(URL_, u), isHttp(503));
  assert.ok(u.calls.length === 3 || u.calls.length === 4, `expected 3 or 4 attempts, got ${u.calls.length}`);
});

test('4xx is not retried', async () => {
  for (const status of [400, 404]) {
    const u = upstream(status, 200);
    await assert.rejects(fetchJson(URL_, u), isHttp(status));
    assert.equal(u.calls.length, 1, `${status} must not be retried`);
    assert.equal(u.naps.length, 0);
  }
});

test('first-try success does not sleep', async () => {
  const u = upstream(200);
  assert.deepEqual(await fetchJson(URL_, u), { status: 200, attempt: 1 });
  assert.equal(u.naps.length, 0);
});

test('network error is retried', async () => {
  const u = upstream(new TypeError('fetch failed'), 200);
  assert.deepEqual(await fetchJson(URL_, u), { status: 200, attempt: 2 });
  assert.equal(u.calls.length, 2);
});

test('persistent network error eventually rejects', async () => {
  const u = upstream(new TypeError('fetch failed'));
  await assert.rejects(fetchJson(URL_, u), /fetch failed/);
  assert.ok(u.calls.length === 3 || u.calls.length === 4, `expected 3 or 4 attempts, got ${u.calls.length}`);
});
