import ast
import inspect
import os
import tempfile
import unittest
from datetime import datetime
from decimal import Decimal

import exporters


class HiddenExportersTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.dir.name, "out.csv")

    def tearDown(self):
        self.dir.cleanup()

    def export(self, fn, rows):
        n = fn(rows, self.path)
        with open(self.path, "rb") as fh:
            return n, fh.read()

    def test_signatures_unchanged(self):
        for name, first in [("export_csv_users", "users"), ("export_csv_orders", "orders"), ("export_csv_products", "products")]:
            params = list(inspect.signature(getattr(exporters, name)).parameters)
            self.assertEqual(params, [first, "path"], name)

    def test_users_bytes(self):
        users = [
            {"id": 1, "name": "Ada Lovelace", "email": "ada@example.com", "created_at": datetime(2024, 3, 1, 23, 59)},
            {"id": 2, "name": 'Smith, "Bob"', "email": "bob@example.com", "created_at": datetime(2023, 12, 31, 0, 0)},
            {"id": 3, "name": "Zoë Ñúñez", "email": "zoe@example.com", "created_at": datetime(2022, 1, 5, 12, 0)},
        ]
        n, data = self.export(exporters.export_csv_users, users)
        self.assertEqual(n, 3)
        self.assertEqual(data, (
            "id,name,email,signed_up\r\n"
            "1,Ada Lovelace,ada@example.com,2024-03-01\r\n"
            '2,"Smith, ""Bob""",bob@example.com,2023-12-31\r\n'
            "3,Zoë Ñúñez,zoe@example.com,2022-01-05\r\n"
        ).encode("utf-8"))

    def test_orders_bytes(self):
        orders = [
            {"id": 10, "user_id": 1, "total": 12.5, "status": "paid"},
            {"id": 11, "user_id": 2, "total": Decimal("3"), "status": "refunded"},
            {"id": 12, "user_id": 2, "total": 19.999, "status": "pending"},
        ]
        n, data = self.export(exporters.export_csv_orders, orders)
        self.assertEqual(n, 3)
        self.assertEqual(data, (
            "order_id,user_id,total,status\r\n"
            "10,1,12.50,paid\r\n"
            "11,2,3.00,refunded\r\n"
            "12,2,20.00,pending\r\n"
        ).encode("utf-8"))

    def test_products_skip_discontinued(self):
        products = [
            {"sku": "MUG-1", "name": "Mug", "price": 8, "stock": 4},
            {"sku": "MUG-2", "name": "Old mug", "price": 6.5, "stock": 9, "discontinued": True},
            {"sku": "TEE-1", "name": "T-shirt, large", "price": 15.25, "stock": 0, "discontinued": False},
        ]
        n, data = self.export(exporters.export_csv_products, products)
        self.assertEqual(n, 2)
        self.assertEqual(data, (
            "sku,name,price,in_stock\r\n"
            "MUG-1,Mug,8.00,yes\r\n"
            'TEE-1,"T-shirt, large",15.25,no\r\n'
        ).encode("utf-8"))

    def test_empty_inputs_write_header_only(self):
        for fn, header in [
            (exporters.export_csv_users, "id,name,email,signed_up"),
            (exporters.export_csv_orders, "order_id,user_id,total,status"),
            (exporters.export_csv_products, "sku,name,price,in_stock"),
        ]:
            n, data = self.export(fn, [])
            self.assertEqual(n, 0)
            self.assertEqual(data, (header + "\r\n").encode())

    def test_accepts_generators(self):
        orders = ({"id": i, "user_id": 1, "total": i, "status": "paid"} for i in range(1, 3))
        n, data = self.export(exporters.export_csv_orders, orders)
        self.assertEqual(n, 2)
        self.assertEqual(data, b"order_id,user_id,total,status\r\n1,1,1.00,paid\r\n2,1,2.00,paid\r\n")

    def test_csv_writing_logic_not_duplicated(self):
        root = os.path.dirname(os.path.abspath(__file__))
        writers = opens = 0
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if not d.startswith(".") and d != "__pycache__"]
            for fname in filenames:
                if not fname.endswith(".py") or fname.startswith("test"):
                    continue
                with open(os.path.join(dirpath, fname), encoding="utf-8") as fh:
                    tree = ast.parse(fh.read())
                for node in ast.walk(tree):
                    if not isinstance(node, ast.Call):
                        continue
                    func = node.func
                    name = func.attr if isinstance(func, ast.Attribute) else getattr(func, "id", None)
                    if name in ("writer", "DictWriter"):
                        writers += 1
                    elif name == "open":
                        opens += 1
        self.assertLessEqual(writers, 1, "CSV writer setup is still copy-pasted")
        self.assertLessEqual(opens, 1, "file opening is still copy-pasted")


if __name__ == "__main__":
    unittest.main()
