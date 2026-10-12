"""Download handlers for the admin dashboard."""
import os
import tempfile

from exporters import export_csv_orders, export_csv_products, export_csv_users

EXPORTS = {
    "users": export_csv_users,
    "orders": export_csv_orders,
    "products": export_csv_products,
}


def download(kind, rows):
    """Export ``rows`` of ``kind`` to a temp file; returns (path, row_count)."""
    try:
        export = EXPORTS[kind]
    except KeyError:
        raise ValueError(f"unknown export: {kind}") from None
    fd, path = tempfile.mkstemp(prefix=f"{kind}-", suffix=".csv")
    os.close(fd)
    return path, export(rows, path)
