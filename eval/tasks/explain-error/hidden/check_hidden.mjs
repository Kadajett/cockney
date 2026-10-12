// Explain-only task: source files must be byte-identical to the originals.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const EXPECTED = {
  "cart.mjs": "85539c5c079d3c6a1c5d72ee4bac4375c6b6c270131b0764fb972ef4b1f88891",
  "app.mjs": "38c7a01c9db9536844f72d259b534da2f6e1a3466d727fce9d923e16b7b7072d",
  "money.mjs": "d63a8924f2777dbe3dd230f27c86557e52ec5f5025572657b20e1759b995cb4e"
};

const bad = [];
for (const [path, digest] of Object.entries(EXPECTED)) {
  let actual = null;
  try {
    actual = createHash("sha256").update(readFileSync(path)).digest("hex");
  } catch {}
  if (actual !== digest) bad.push(path);
}
if (bad.length) {
  console.log(`modified: ${bad.join(", ")}`);
  process.exit(1);
}
console.log("sources unchanged");
