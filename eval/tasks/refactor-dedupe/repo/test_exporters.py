import os
import tempfile
import unittest
from datetime import datetime

from exporters import export_csv_orders, export_csv_products, export_csv_users


class ExportersTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.dir.name, "out.csv")

    def tearDown(self):
        self.dir.cleanup()

    def read(self):
        with open(self.path, newline="", encoding="utf-8") as fh:
            return fh.read()

    def test_users(self):
        n = export_csv_users([{"id": 1, "name": "Ada", "email": "ada@example.com", "created_at": datetime(2024, 3, 1, 9, 30)}], self.path)
        self.assertEqual(n, 1)
        self.assertEqual(self.read(), "id,name,email,signed_up\r\n1,Ada,ada@example.com,2024-03-01\r\n")

    def test_orders(self):
        n = export_csv_orders([{"id": 7, "user_id": 1, "total": 12.5, "status": "paid"}], self.path)
        self.assertEqual(n, 1)
        self.assertEqual(self.read(), "order_id,user_id,total,status\r\n7,1,12.50,paid\r\n")

    def test_products(self):
        n = export_csv_products([{"sku": "MUG-1", "name": "Mug", "price": 8, "stock": 0}], self.path)
        self.assertEqual(n, 1)
        self.assertEqual(self.read(), "sku,name,price,in_stock\r\nMUG-1,Mug,8.00,no\r\n")


if __name__ == "__main__":
    unittest.main()
