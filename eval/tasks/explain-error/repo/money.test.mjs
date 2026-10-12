import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPence } from "./money.mjs";

test("formats pence as pounds", () => {
  assert.equal(formatPence(1234), "£12.34");
  assert.equal(formatPence(5), "£0.05");
});
