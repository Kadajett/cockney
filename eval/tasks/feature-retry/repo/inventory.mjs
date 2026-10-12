import { fetchJson } from './client.mjs';
import { sleep as realSleep } from './util.mjs';

const BASE = 'https://inventory.internal/api';

export function getItem(sku, opts) {
  return fetchJson(`${BASE}/items/${encodeURIComponent(sku)}`, opts);
}

// Poll until the item is back in stock. `sleep` is injectable so tests don't wait.
export async function waitForStock(sku, { sleep = realSleep, interval = 5000, attempts = 10, ...opts } = {}) {
  for (let i = 0; i < attempts; i++) {
    const item = await getItem(sku, opts);
    if (item.stock > 0) return item;
    await sleep(interval);
  }
  throw new Error(`${sku} still out of stock after ${attempts} checks`);
}
