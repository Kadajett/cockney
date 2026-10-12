"""CSV exports behind the admin dashboard's "Download" buttons."""
import csv


def export_csv_users(users, path):
    """Write users to ``path`` as CSV. Returns the number of rows written."""
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["id", "name", "email", "signed_up"])
        count = 0
        for user in users:
            writer.writerow([user["id"], user["name"], user["email"], user["created_at"].date().isoformat()])
            count += 1
    return count


def export_csv_orders(orders, path):
    """Write orders to ``path`` as CSV. Returns the number of rows written."""
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["order_id", "user_id", "total", "status"])
        count = 0
        for order in orders:
            writer.writerow([order["id"], order["user_id"], f"{order['total']:.2f}", order["status"]])
            count += 1
    return count


def export_csv_products(products, path):
    """Write products to ``path`` as CSV, skipping discontinued ones. Returns rows written."""
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["sku", "name", "price", "in_stock"])
        count = 0
        for product in products:
            if product.get("discontinued"):
                continue
            writer.writerow([product["sku"], product["name"], f"{product['price']:.2f}", "yes" if product["stock"] > 0 else "no"])
            count += 1
    return count
