// Invoice calculations. See README for the tax rule.
// Money is handled in integer cents to avoid binary floating-point drift.

export const TAX_PERCENT = 7.5;

const toCents = (dollars) => Math.round(dollars * 100);
const formatCents = (cents) => (cents / 100).toFixed(2);

function lineCents(item) {
  return toCents(item.price) * item.qty;
}

export function lineTotal(item) {
  return lineCents(item) / 100;
}

export function invoiceTotals(items, { taxPercent = TAX_PERCENT } = {}) {
  const subtotal = items.reduce((sum, item) => sum + lineCents(item), 0);
  const tax = Math.round((subtotal * taxPercent) / 100);
  return {
    subtotal: formatCents(subtotal),
    tax: formatCents(tax),
    total: formatCents(subtotal + tax),
  };
}

export function formatInvoice(customer, items, options) {
  const { subtotal, tax, total } = invoiceTotals(items, options);
  const lines = [`Invoice for ${customer}`];
  for (const item of items) {
    lines.push(`  ${item.qty} x ${item.name.padEnd(20)} ${formatCents(lineCents(item)).padStart(9)}`);
  }
  lines.push(`  ${"Subtotal".padEnd(24)} ${subtotal.padStart(9)}`);
  lines.push(`  ${"Tax".padEnd(24)} ${tax.padStart(9)}`);
  lines.push(`  ${"Total".padEnd(24)} ${total.padStart(9)}`);
  return lines.join("\n");
}
