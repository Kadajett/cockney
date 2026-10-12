// Thin JSON client for the inventory upstream.
import { sleep as realSleep } from './util.mjs';

const RETRIES = 3;
const BACKOFF_MS = 100;

export class HttpError extends Error {
  constructor(status, url) {
    super(`HTTP ${status} from ${url}`);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

// Retries 503s and network errors up to RETRIES times with exponential backoff.
export async function fetchJson(url, { fetch = globalThis.fetch, sleep = realSleep, headers = {} } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, { headers: { accept: 'application/json', ...headers } });
    } catch (err) {
      if (attempt === RETRIES) throw err;
    }
    if (res && (res.status !== 503 || attempt === RETRIES)) {
      if (!res.ok) throw new HttpError(res.status, url);
      return res.json();
    }
    await sleep(BACKOFF_MS * 2 ** attempt);
  }
}
