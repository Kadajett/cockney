"""Billing: build invoices and compute totals.

v2 works in integer pence. The legacy_* helpers are the old v1 float path.
"""
from billing.invoice import Invoice, LineItem
from billing.legacy import LEGACY_VAT, legacy_charge_card, legacy_round
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


def legacy_create_invoice(customer_id, amount_pounds):
    """DEPRECATED v1: single-amount invoice as a dict, floats in pounds."""
    return {"customer": customer_id, "amount": legacy_round(amount_pounds), "vat": LEGACY_VAT}


def legacy_invoice_total(invoice_dict):
    """DEPRECATED v1."""
    return legacy_round(invoice_dict["amount"] * (1 + invoice_dict["vat"]))


__all__ = [
    "Invoice",
    "LineItem",
    "apply_tax",
    "tax_rate_for",
    "create_invoice",
    "invoice_total",
    "legacy_create_invoice",
    "legacy_invoice_total",
    "legacy_charge_card",
]
