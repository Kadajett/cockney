import test from "node:test";
import assert from "node:assert/strict";
import { fetchAll } from "./loader.mjs";
import { loadUserNames } from "./users.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("results come back in input order even when fetches finish out of order", async () => {
  const delays = { a: 30, b: 5, c: 15, d: 0 };
  const result = await fetchAll(["a", "b", "c", "d"], async (id) => {
    await sleep(delays[id]);
    return id.toUpperCase();
  });
  assert.deepEqual(result, ["A", "B", "C", "D"]);
});

test("synchronous fetchOne results are returned", async () => {
  assert.deepEqual(await fetchAll([1, 2, 3], (id) => id * 10), [10, 20, 30]);
});

test("duplicate ids each get a result", async () => {
  assert.deepEqual(await fetchAll([2, 2, 1], async (id) => `u${id}`), ["u2", "u2", "u1"]);
});

test("empty input resolves to an empty list", async () => {
  let calls = 0;
  const result = await fetchAll([], async () => {
    calls += 1;
  });
  assert.deepEqual(result, []);
  assert.equal(calls, 0);
});

test("a rejected fetch rejects fetchAll with the same error", async () => {
  const boom = new Error("user 2 not found");
  await assert.rejects(
    fetchAll([1, 2, 3], async (id) => {
      await sleep(id);
      if (id === 2) throw boom;
      return id;
    }),
    (err) => err === boom,
  );
});

test("fetches run concurrently, not one after another", async () => {
  const started = performance.now();
  await fetchAll([1, 2, 3, 4, 5], () => sleep(80));
  assert.ok(performance.now() - started < 300, "expected concurrent fetches");
});

test("loadUserNames returns names in requested order", async () => {
  const api = {
    async getUser(id) {
      await sleep(id === 7 ? 20 : 1);
      return { id, name: { 7: "Ada", 3: "Bo", 9: "Cy" }[id] };
    },
  };
  assert.deepEqual(await loadUserNames(api, [7, 3, 9, 3]), ["Ada", "Bo", "Cy"]);
});
