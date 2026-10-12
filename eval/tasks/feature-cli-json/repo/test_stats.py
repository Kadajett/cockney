import unittest

from stats import combine, count_text, format_stats


class CountTests(unittest.TestCase):
    def test_counts(self):
        s = count_text("a.txt", "hello world\nsecond line here\n")
        self.assertEqual((s.lines, s.words, s.chars), (2, 5, 29))

    def test_empty(self):
        s = count_text("e.txt", "")
        self.assertEqual((s.lines, s.words, s.chars), (0, 0, 0))

    def test_combine(self):
        total = combine([count_text("a", "x y\n"), count_text("b", "z\n")])
        self.assertEqual(format_stats(total), "total: 2 lines, 3 words, 6 chars")


if __name__ == "__main__":
    unittest.main()
