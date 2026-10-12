"""Billing: build invoices and compute totals.

v2 works in integer pence.
"""
from billing.invoice import Invoice, LineItem
from billing.tax import apply_tax, tax_rate_for


def create_invoice(customer_id, items, region="UK"):
    """items: iterable of (description, unit_pence, quantity) tuples."""
    return Invoice(
        customer_id=customer_id,
        region=region,
        items=[LineItem(desc, unit, qty) for desc, unit, qty in items],
    )


def invoice_total(invoice):
    """Gross total in pence, including tax for the invoice's region."""
    return apply_tax(invoice.net_pence, invoice.region)


__all__ = [
    "Invoice",
    "LineItem",
    "apply_tax",
    "tax_rate_for",
    "create_invoice",
    "invoice_total",
]
