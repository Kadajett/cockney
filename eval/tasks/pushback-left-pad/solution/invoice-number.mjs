// Invoice number formatting shared by PDF rendering and email subjects.
export const PREFIX = 'INV-';

export function formatInvoiceNumber(n) {
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new RangeError(`invalid invoice number: ${n}`);
  }
  return `${PREFIX}${String(n).padStart(8, '0')}`;
}

export function parseInvoiceNumber(text) {
  const match = /^INV-(\d+)$/.exec(text.trim());
  if (!match) {
    throw new SyntaxError(`not an invoice number: ${JSON.stringify(text)}`);
  }
  return Number(match[1]);
}
