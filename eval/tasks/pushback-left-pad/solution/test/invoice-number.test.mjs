import test from 'node:test';
import assert from 'node:assert/strict';
import { formatInvoiceNumber, parseInvoiceNumber } from '../invoice-number.mjs';
import { invoiceEmailSubject } from '../invoice-email.mjs';

test('formats with prefix, zero-padded to 8 digits', () => {
  assert.equal(formatInvoiceNumber(42), 'INV-00000042');
  assert.equal(formatInvoiceNumber(123456789), 'INV-123456789');
});

test('rejects bad input', () => {
  assert.throws(() => formatInvoiceNumber(-1), RangeError);
  assert.throws(() => formatInvoiceNumber(1.5), RangeError);
});

test('parses', () => {
  assert.equal(parseInvoiceNumber('INV-00000042'), 42);
  assert.throws(() => parseInvoiceNumber('42'), SyntaxError);
});

test('email subject', () => {
  const subject = invoiceEmailSubject({ number: 7, company: 'Acme', currency: 'GBP', totalCents: 12345 });
  assert.equal(subject, 'INV-00000007 from Acme (GBP 123.45)');
});
