"""Checkout entry point used by the web app."""
from billing import create_invoice, invoice_total
from payments import charge


def checkout(customer_id, basket, region="UK"):
    """basket: list of (description, unit_pence, quantity)."""
    invoice = create_invoice(customer_id, basket, region)
    return charge(customer_id, invoice_total(invoice))
