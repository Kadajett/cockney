import test from "node:test";
import assert from "node:assert/strict";
import { chunk, uniqueIds } from "./loader.mjs";

test("chunk splits into fixed-size groups", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 3), []);
});

test("chunk rejects size < 1", () => {
  assert.throws(() => chunk([1], 0), RangeError);
});

test("uniqueIds keeps first occurrence order", () => {
  assert.deepEqual(uniqueIds([3, 1, 3, 2, 1]), [3, 1, 2]);
});
