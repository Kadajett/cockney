import test from "node:test";
import assert from "node:assert/strict";
import { invoiceTotals, formatInvoice } from "./invoice.mjs";

test("round numbers", () => {
  assert.deepEqual(invoiceTotals([{ name: "Kettle", price: 20, qty: 1 }]), {
    subtotal: "20.00",
    tax: "1.50",
    total: "21.50",
  });
});

test("empty invoice", () => {
  assert.deepEqual(invoiceTotals([]), { subtotal: "0.00", tax: "0.00", total: "0.00" });
});

test("formatInvoice lists every line", () => {
  const text = formatInvoice("Ada", [
    { name: "Tea", price: 3.5, qty: 2 },
    { name: "Mug", price: 6.5, qty: 1 },
  ]);
  assert.match(text, /2 x Tea/);
  assert.match(text, /1 x Mug/);
  assert.match(text, /Total\s+14\.51/);
});
