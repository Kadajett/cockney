// Usage: node cli.mjs order.json  ->  prints the invoice for an order file
// order.json: { "customer": "Ada", "items": [{ "name": "Tea", "price": 3.5, "qty": 2 }] }
import { readFileSync } from "node:fs";
import { formatInvoice } from "./invoice.mjs";

const [, , file] = process.argv;
if (!file) {
  console.error("usage: node cli.mjs <order.json>");
  process.exit(2);
}
const order = JSON.parse(readFileSync(file, "utf8"));
console.log(formatInvoice(order.customer, order.items));
