"""CSV exports behind the admin dashboard's "Download" buttons."""
import csv


def _write_csv(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(header)
        count = 0
        for row in rows:
            writer.writerow(row)
            count += 1
    return count


def export_csv_users(users, path):
    """Write users to ``path`` as CSV. Returns the number of rows written."""
    return _write_csv(path, ["id", "name", "email", "signed_up"], (
        [u["id"], u["name"], u["email"], u["created_at"].date().isoformat()] for u in users
    ))


def export_csv_orders(orders, path):
    """Write orders to ``path`` as CSV. Returns the number of rows written."""
    return _write_csv(path, ["order_id", "user_id", "total", "status"], (
        [o["id"], o["user_id"], f"{o['total']:.2f}", o["status"]] for o in orders
    ))


def export_csv_products(products, path):
    """Write products to ``path`` as CSV, skipping discontinued ones. Returns rows written."""
    return _write_csv(path, ["sku", "name", "price", "in_stock"], (
        [p["sku"], p["name"], f"{p['price']:.2f}", "yes" if p["stock"] > 0 else "no"]
        for p in products if not p.get("discontinued")
    ))
