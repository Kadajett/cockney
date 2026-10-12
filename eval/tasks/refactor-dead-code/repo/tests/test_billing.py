import unittest

from billing import create_invoice, invoice_total
from checkout import checkout


class BillingTests(unittest.TestCase):
    def test_uk_total(self):
        inv = create_invoice("c1", [("Widget", 1000, 2)])
        self.assertEqual(invoice_total(inv), 2400)

    def test_checkout_charges_gross(self):
        self.assertEqual(checkout("c2", [("Mug", 500, 1)])["amount_pence"], 600)


if __name__ == "__main__":
    unittest.main()
