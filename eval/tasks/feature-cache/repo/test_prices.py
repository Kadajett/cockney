import unittest
from decimal import Decimal

import prices


class PricesTest(unittest.TestCase):
    def test_get_price_includes_vat(self):
        # ABC-1 is 2243p net, plus 20% VAT
        self.assertEqual(prices.get_price("ABC-1"), Decimal("26.92"))

    def test_basket_total(self):
        total = prices.basket_total([("ABC-1", 2), ("ABC-2", 1)])
        self.assertEqual(total, prices.get_price("ABC-1") * 2 + prices.get_price("ABC-2"))

    def test_unknown_sku(self):
        with self.assertRaises(KeyError):
            prices.get_price("X-404")


if __name__ == "__main__":
    unittest.main()
