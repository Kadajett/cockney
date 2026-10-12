import unittest

import billing


class LegacyV1Tests(unittest.TestCase):
    def test_legacy_total(self):
        inv = billing.legacy_create_invoice("c1", 10.0)
        self.assertEqual(billing.legacy_invoice_total(inv), 11.75)


if __name__ == "__main__":
    unittest.main()
