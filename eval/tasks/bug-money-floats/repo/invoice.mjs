// Invoice calculations. See README for the tax rule.

export const TAX_PERCENT = 7.5;

export function lineTotal(item) {
  return item.price * item.qty;
}

export function invoiceTotals(items, { taxPercent = TAX_PERCENT } = {}) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const tax = (subtotal * taxPercent) / 100;
  const total = subtotal + tax;
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
}

export function formatInvoice(customer, items, options) {
  const { subtotal, tax, total } = invoiceTotals(items, options);
  const lines = [`Invoice for ${customer}`];
  for (const item of items) {
    lines.push(`  ${item.qty} x ${item.name.padEnd(20)} ${lineTotal(item).toFixed(2).padStart(9)}`);
  }
  lines.push(`  ${"Subtotal".padEnd(24)} ${subtotal.padStart(9)}`);
  lines.push(`  ${"Tax".padEnd(24)} ${tax.padStart(9)}`);
  lines.push(`  ${"Total".padEnd(24)} ${total.padStart(9)}`);
  return lines.join("\n");
}
