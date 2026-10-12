"""Price lookups used by the basket and invoice code."""
from decimal import Decimal
from functools import cache

import backend

VAT_RATE = Decimal("0.20")


@cache
def get_price(sku):
    """Unit price for ``sku`` in pounds, including VAT."""
    record = backend.fetch_price(sku)
    net = Decimal(record["unit_price_cents"]) / 100
    return (net * (1 + VAT_RATE)).quantize(Decimal("0.01"))


def basket_total(lines):
    """Total for an iterable of (sku, quantity) pairs."""
    return sum((get_price(sku) * qty for sku, qty in lines), Decimal("0.00"))
