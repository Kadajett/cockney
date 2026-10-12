import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson, HttpError } from './client.mjs';
import { waitForStock } from './inventory.mjs';

const respond = (status, body = {}) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('returns parsed JSON and sends accept header', async () => {
  let seen;
  const fetch = async (url, init) => { seen = init; return respond(200, { sku: 'A1' }); };
  assert.deepEqual(await fetchJson('https://x/items/A1', { fetch }), { sku: 'A1' });
  assert.equal(seen.headers.accept, 'application/json');
});

test('throws HttpError on non-2xx', async () => {
  const fetch = async () => respond(404);
  await assert.rejects(fetchJson('https://x/items/nope', { fetch }), (err) => err instanceof HttpError && err.status === 404);
});

test('waitForStock polls until stock arrives', async () => {
  const stock = [0, 0, 3];
  const fetch = async () => respond(200, { sku: 'A1', stock: stock.shift() });
  const naps = [];
  const item = await waitForStock('A1', { fetch, sleep: async (ms) => naps.push(ms) });
  assert.equal(item.stock, 3);
  assert.equal(naps.length, 2);
});
