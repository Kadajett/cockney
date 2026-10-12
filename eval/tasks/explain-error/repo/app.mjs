import { createServer } from "node:http";
import { Cart } from "./cart.mjs";
import { formatPence } from "./money.mjs";

export function checkout(order) {
  const cart = new Cart(order.customerId);
  for (const line of order.lines) cart.add(line.sku, line.price, line.qty);
  return { customerId: cart.customerId, items: cart.count, total: formatPence(cart.total) };
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(JSON.parse(body || "{}")));
    req.on("error", reject);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/checkout") {
      res.writeHead(404).end();
      return;
    }
    const order = await readJson(req);
    console.log(`${new Date().toISOString()} INFO checkout customer=${order.customerId} lines=${order.lines.length}`);
    const receipt = checkout(order);
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(receipt));
  }).listen(8080, () => console.log(`${new Date().toISOString()} INFO listening on :8080`));
}
