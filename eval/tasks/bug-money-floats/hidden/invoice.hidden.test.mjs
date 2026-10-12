import test from "node:test";
import assert from "node:assert/strict";
import { invoiceTotals, formatInvoice } from "./invoice.mjs";

const item = (price, qty = 1, name = "Item") => ({ name, price, qty });

const cases = [
  // [items, subtotal, tax, total]
  [[item(1.4)], "1.40", "0.11", "1.51"], // tax 0.105 -> 0.11
  [[item(5.8)], "5.80", "0.44", "6.24"], // tax 0.435 -> 0.44
  [[item(0.6, 3)], "1.80", "0.14", "1.94"], // tax 0.135 -> 0.14
  [[item(3.35, 4)], "13.40", "1.01", "14.41"], // tax 1.005 -> 1.01
  [[item(0.1), item(1.9, 3)], "5.80", "0.44", "6.24"],
  [[item(0.2), item(1.2, 3)], "3.80", "0.29", "4.09"],
  [[item(0.1, 3)], "0.30", "0.02", "0.32"], // tax 0.0225 -> 0.02
  [[item(19.99, 2), item(4.35), item(0.1, 3)], "44.63", "3.35", "47.98"],
  [[item(12.3)], "12.30", "0.92", "13.22"],
  [[], "0.00", "0.00", "0.00"],
];

for (const [items, subtotal, tax, total] of cases) {
  test(`totals for ${JSON.stringify(items.map((i) => [i.price, i.qty]))}`, () => {
    assert.deepEqual(invoiceTotals(items), { subtotal, tax, total });
  });
}

test("total always equals subtotal + displayed tax", () => {
  for (let cents = 1; cents <= 2000; cents += 1) {
    const { subtotal, tax, total } = invoiceTotals([item(cents / 100)]);
    const sum = Math.round(Number(subtotal) * 100) + Math.round(Number(tax) * 100);
    assert.equal(Math.round(Number(total) * 100), sum, `price ${cents / 100}`);
  }
});

test("printed invoice shows the corrected totals", () => {
  const text = formatInvoice("Ada", [item(1.4, 1, "Tea towel")]);
  assert.match(text, /Tax\s+0\.11\b/);
  assert.match(text, /Total\s+1\.51\b/);
  assert.match(text, /1 x Tea towel\s+1\.40\b/);
});
