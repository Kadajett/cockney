import importlib
import unittest

import billing
from checkout import checkout

PUBLIC = ["Invoice", "LineItem", "apply_tax", "tax_rate_for", "create_invoice", "invoice_total"]


class RemainingApiTests(unittest.TestCase):
    def test_create_and_total_uk(self):
        inv = billing.create_invoice("c1", [("Widget", 1000, 2), ("Gadget", 250, 1)], region="UK")
        self.assertEqual(inv.net_pence, 2250)
        self.assertEqual(billing.invoice_total(inv), 2700)

    def test_other_regions(self):
        self.assertEqual(billing.invoice_total(billing.create_invoice("c", [("x", 1000, 1)], "IE")), 1230)
        self.assertEqual(billing.invoice_total(billing.create_invoice("c", [("x", 1000, 1)], "US")), 1000)
        with self.assertRaises(ValueError):
            billing.invoice_total(billing.create_invoice("c", [("x", 1000, 1)], "XX"))

    def test_public_names_still_exported(self):
        for name in PUBLIC:
            self.assertTrue(hasattr(billing, name), name)
            if hasattr(billing, "__all__"):
                self.assertIn(name, billing.__all__)
        self.assertEqual(billing.apply_tax(999, "UK"), 1199)
        self.assertEqual(billing.tax_rate_for("DE"), 0.19)

    def test_checkout(self):
        result = checkout("c9", [("Book", 999, 1)])
        self.assertEqual(result, {"customer": "c9", "amount_pence": 1199, "status": "ok"})


class LegacyRemovedTests(unittest.TestCase):
    def test_legacy_module_gone(self):
        with self.assertRaises(ModuleNotFoundError):
            importlib.import_module("billing.legacy")

    def test_no_legacy_names_exported(self):
        leftovers = [n for n in dir(billing) if n.lower().startswith("legacy")]
        self.assertEqual(leftovers, [])
        for name in getattr(billing, "__all__", []):
            self.assertFalse(name.lower().startswith("legacy"), name)


if __name__ == "__main__":
    unittest.main()
