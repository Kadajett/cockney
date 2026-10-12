import unittest
from decimal import Decimal

import backend
import prices


def expected(sku):
    net = Decimal(199 + sum(map(ord, sku)) * 7 % 9800) / 100
    return (net * Decimal("1.20")).quantize(Decimal("0.01"))


class HiddenCacheTest(unittest.TestCase):
    # Every test uses SKUs no other test touches, so a process-wide cache is fine.

    def test_repeated_sku_hits_backend_once(self):
        results = [prices.get_price("HC-SAME-1") for _ in range(5)]
        self.assertEqual(results, [expected("HC-SAME-1")] * 5)
        self.assertEqual(backend.calls["HC-SAME-1"], 1)

    def test_distinct_skus_each_fetched_once(self):
        skus = ["HC-D-1", "HC-D-2", "HC-D-3"]
        for _ in range(3):
            for sku in skus:
                self.assertEqual(prices.get_price(sku), expected(sku))
        for sku in skus:
            self.assertEqual(backend.calls[sku], 1, sku)

    def test_basket_total_uses_cache(self):
        lines = [("HC-B-1", 2), ("HC-B-2", 1), ("HC-B-1", 3)]
        want = expected("HC-B-1") * 5 + expected("HC-B-2")
        self.assertEqual(prices.basket_total(lines), want)
        self.assertEqual(prices.basket_total(lines), want)
        self.assertEqual(backend.calls["HC-B-1"], 1)
        self.assertEqual(backend.calls["HC-B-2"], 1)

    def test_unknown_sku_still_raises(self):
        for _ in range(2):
            with self.assertRaises(KeyError):
                prices.get_price("X-HC-MISSING")
        self.assertEqual(prices.get_price("HC-AFTER-ERR"), expected("HC-AFTER-ERR"))


if __name__ == "__main__":
    unittest.main()
