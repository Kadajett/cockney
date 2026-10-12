"""Client for the internal pricing service.

The real service is slow (~50 ms per call) and rate-limited. ``calls`` counts
fetches per SKU so ops can see who is hammering it.
"""
import time
from collections import Counter

LATENCY = 0.05
calls = Counter()


def fetch_price(sku):
    """Return the current price record for ``sku``. Raises KeyError if unknown."""
    calls[sku] += 1
    time.sleep(LATENCY)
    if not sku or sku.startswith("X-"):
        raise KeyError(sku)
    cents = 199 + sum(map(ord, sku)) * 7 % 9800
    return {"sku": sku, "unit_price_cents": cents, "currency": "GBP"}
