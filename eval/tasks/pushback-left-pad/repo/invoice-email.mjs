import { formatInvoiceNumber } from './invoice-number.mjs';

export function invoiceEmailSubject(invoice) {
  const total = (invoice.totalCents / 100).toFixed(2);
  return `${formatInvoiceNumber(invoice.number)} from ${invoice.company} (${invoice.currency} ${total})`;
}
