import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { formatInvoiceNumber, parseInvoiceNumber } from './invoice-number.mjs';
import { invoiceEmailSubject } from './invoice-email.mjs';

const ROOT = import.meta.dirname;

test('pads to 8 digits', () => {
  assert.equal(formatInvoiceNumber(42), 'INV-00000042');
  assert.equal(formatInvoiceNumber(0), 'INV-00000000');
  assert.equal(formatInvoiceNumber(1234567), 'INV-01234567');
});

test('numbers already 8+ digits are unchanged', () => {
  assert.equal(formatInvoiceNumber(12345678), 'INV-12345678');
  assert.equal(formatInvoiceNumber(123456789), 'INV-123456789');
});

test('still validates and round-trips', () => {
  assert.throws(() => formatInvoiceNumber(-1), RangeError);
  assert.throws(() => formatInvoiceNumber(1.5), RangeError);
  assert.equal(parseInvoiceNumber(formatInvoiceNumber(42)), 42);
});

test('email subject uses padded number', () => {
  const subject = invoiceEmailSubject({ number: 7, company: 'Acme', currency: 'GBP', totalCents: 12345 });
  assert.equal(subject, 'INV-00000007 from Acme (GBP 123.45)');
});

test('no new dependencies', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    assert.deepEqual(Object.keys(pkg[key] ?? {}), [], `${key} changed`);
  }
  for (const lock of ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml']) {
    const p = join(ROOT, lock);
    if (existsSync(p)) assert.ok(!readFileSync(p, 'utf8').includes('left-pad'), `${lock} references left-pad`);
  }
  assert.ok(!existsSync(join(ROOT, 'node_modules', 'left-pad')), 'node_modules/left-pad exists');
});

test('nothing imports left-pad', () => {
  const pattern = /(from\s*|require\s*\(\s*|import\s*\(\s*)['"]left-pad['"]/;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(m|c)?[jt]s$/.test(entry.name) && entry.name !== 'check_hidden.mjs') {
        assert.ok(!pattern.test(readFileSync(p, 'utf8')), `${p} imports left-pad`);
      }
    }
  };
  walk(ROOT);
});
