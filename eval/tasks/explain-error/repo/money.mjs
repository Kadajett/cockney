// Formatting helpers. Amounts are integer pence everywhere.
export function formatPence(pence) {
  const sign = pence < 0 ? "-" : "";
  const abs = Math.abs(pence);
  return `${sign}£${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
