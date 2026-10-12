// Thin JSON client for the inventory upstream.

export class HttpError extends Error {
  constructor(status, url) {
    super(`HTTP ${status} from ${url}`);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

export async function fetchJson(url, { fetch = globalThis.fetch, headers = {} } = {}) {
  const res = await fetch(url, { headers: { accept: 'application/json', ...headers } });
  if (!res.ok) throw new HttpError(res.status, url);
  return res.json();
}
