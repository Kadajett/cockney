import unittest

from listing import page_count, paginate


class PageCountTests(unittest.TestCase):
    def test_exact_multiple(self):
        self.assertEqual(page_count(list(range(20)), 10), 2)

    def test_partial_last_page(self):
        self.assertEqual(page_count(list(range(21)), 10), 3)

    def test_empty(self):
        self.assertEqual(page_count([], 10), 0)


class PaginateValidationTests(unittest.TestCase):
    def test_rejects_page_zero(self):
        with self.assertRaises(ValueError):
            paginate([1, 2, 3], 0, 2)

    def test_rejects_zero_per_page(self):
        with self.assertRaises(ValueError):
            paginate([1, 2, 3], 1, 0)


if __name__ == "__main__":
    unittest.main()
