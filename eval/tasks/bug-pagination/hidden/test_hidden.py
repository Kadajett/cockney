import re
import unittest

from listing import paginate
from report import render_orders_page


class PaginateHiddenTests(unittest.TestCase):
    items = list(range(1, 24))  # 23 items -> pages of 10, 10, 3

    def test_first_page(self):
        self.assertEqual(paginate(self.items, 1, 10), list(range(1, 11)))

    def test_middle_page(self):
        self.assertEqual(paginate(self.items, 2, 10), list(range(11, 21)))

    def test_last_partial_page(self):
        self.assertEqual(paginate(self.items, 3, 10), [21, 22, 23])

    def test_page_past_end_is_empty(self):
        self.assertEqual(paginate(self.items, 4, 10), [])
        self.assertEqual(paginate(self.items, 50, 10), [])

    def test_per_page_larger_than_list(self):
        self.assertEqual(paginate([7, 8, 9], 1, 50), [7, 8, 9])

    def test_per_page_one(self):
        self.assertEqual(paginate(["a", "b", "c"], 2, 1), ["b"])
        self.assertEqual(paginate(["a", "b", "c"], 3, 1), ["c"])

    def test_every_item_appears_exactly_once(self):
        for per_page in (1, 2, 3, 7, 10, 23, 24):
            seen = []
            page = 1
            while True:
                chunk = paginate(self.items, page, per_page)
                if not chunk:
                    break
                self.assertLessEqual(len(chunk), per_page)
                seen.extend(chunk)
                page += 1
            self.assertEqual(seen, self.items, f"per_page={per_page}")

    def test_empty_list(self):
        self.assertEqual(paginate([], 1, 10), [])


class OrderReportHiddenTests(unittest.TestCase):
    orders = [
        {"id": 1000 + n, "customer": f"customer-{n}", "total": 10.0 * n}
        for n in range(1, 14)
    ]

    def ids_on_page(self, page):
        text = render_orders_page(self.orders, page, per_page=10)
        return [int(m) for m in re.findall(r"#\s*(\d+)", text)]

    def test_each_order_on_exactly_one_page(self):
        self.assertEqual(self.ids_on_page(1), list(range(1001, 1011)))
        self.assertEqual(self.ids_on_page(2), [1011, 1012, 1013])

    def test_header(self):
        text = render_orders_page(self.orders, 2, per_page=10)
        self.assertTrue(text.startswith("Orders - page 2 of 2"))


if __name__ == "__main__":
    unittest.main()
