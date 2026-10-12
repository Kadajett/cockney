// Paired, small-sample statistics: exact Wilcoxon signed-rank, exact sign test, bootstrap CI.

export function median(values: readonly number[]): number {
  if (values.length === 0) return Number.NaN;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? (s[mid] ?? Number.NaN) : ((s[mid - 1] ?? 0) + (s[mid] ?? 0)) / 2;
}

export const mean = (values: readonly number[]): number =>
  values.length === 0 ? Number.NaN : values.reduce((a, b) => a + b, 0) / values.length;

// Two-sided exact Wilcoxon signed-rank test. Zero differences are dropped; tied |d| get
// average ranks, handled exactly by working in doubled ranks.
export function wilcoxon(diffs: readonly number[]): { n: number; p: number } {
  const nonzero = diffs.filter((d) => d !== 0);
  const n = nonzero.length;
  if (n === 0) return { n, p: 1 };
  const order = nonzero.map((d, i) => ({ abs: Math.abs(d), i })).sort((a, b) => a.abs - b.abs);
  const doubled = new Array<number>(n).fill(0);
  for (let start = 0; start < n; ) {
    let end = start;
    while (end + 1 < n && order[end + 1]?.abs === order[start]?.abs) end++;
    for (let k = start; k <= end; k++) doubled[order[k]?.i ?? 0] = start + end + 2; // 2 × average rank
    start = end + 1;
  }
  const total = doubled.reduce((a, b) => a + b, 0);
  const wPlus = nonzero.reduce((sum, d, i) => sum + (d > 0 ? (doubled[i] ?? 0) : 0), 0);
  // counts[s] = number of sign assignments whose positive doubled-rank sum is s.
  let counts = new Array<number>(total + 1).fill(0);
  counts[0] = 1;
  for (const r of doubled) {
    const next = [...counts];
    for (let s = 0; s + r <= total; s++) next[s + r] = (next[s + r] ?? 0) + (counts[s] ?? 0);
    counts = next;
  }
  const all = 2 ** n;
  const tail = Math.min(wPlus, total - wPlus);
  const lower = counts.slice(0, tail + 1).reduce((a, b) => a + b, 0);
  return { n, p: Math.min(1, (2 * lower) / all) };
}

function choose(n: number, k: number): number {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
}

// Two-sided exact sign test on paired wins/losses (ties excluded).
export function signTest(wins: number, losses: number): number {
  const n = wins + losses;
  if (n === 0) return 1;
  const k = Math.min(wins, losses);
  let tail = 0;
  for (let i = 0; i <= k; i++) tail += choose(n, i);
  return Math.min(1, (2 * tail) / 2 ** n);
}

// Deterministic PRNG so reports are reproducible.
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function bootstrapMedianCI(values: readonly number[], iters = 4000, seed = 1): [number, number] {
  if (values.length === 0) return [Number.NaN, Number.NaN];
  const random = rng(seed);
  const medians = Array.from({ length: iters }, () =>
    median(Array.from({ length: values.length }, () => values[Math.floor(random() * values.length)] ?? 0)),
  ).sort((a, b) => a - b);
  return [medians[Math.floor(iters * 0.025)] ?? Number.NaN, medians[Math.floor(iters * 0.975)] ?? Number.NaN];
}
