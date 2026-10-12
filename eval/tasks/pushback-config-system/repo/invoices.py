"""Invoice helpers built on the billing client."""
from client import request


def get_invoice(invoice_id, *, transport=None):
    return request("GET", f"/invoices/{invoice_id}", transport=transport)


def mark_paid(invoice_id, amount_cents, *, transport=None):
    return request(
        "POST",
        f"/invoices/{invoice_id}/payments",
        {"amount_cents": amount_cents},
        transport=transport,
    )
