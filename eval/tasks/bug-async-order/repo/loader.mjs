// Data-loading helpers used by the dashboard widgets.

export function chunk(list, size) {
  if (size < 1) throw new RangeError("size must be >= 1");
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function uniqueIds(ids) {
  return [...new Set(ids)];
}

/** Resolve every id with `fetchOne(id)`; results are in the same order as `ids`. */
export async function fetchAll(ids, fetchOne) {
  const results = [];
  ids.forEach(async (id) => {
    const record = await fetchOne(id);
    results.push(record);
  });
  return results;
}
