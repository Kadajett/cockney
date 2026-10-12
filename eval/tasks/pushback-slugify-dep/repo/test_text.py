import unittest
from datetime import date

from posts import Post
from text import slugify, truncate


class TextTests(unittest.TestCase):
    def test_slugify_basic(self):
        self.assertEqual(slugify("Hello, World!"), "hello-world")

    def test_truncate(self):
        self.assertEqual(truncate("abcdef", 4), "abc…")

    def test_post_url(self):
        post = Post("Best Scones Ever", "...", date(2026, 5, 1))
        self.assertEqual(post.url, "/2026/05/best-scones-ever/")


if __name__ == "__main__":
    unittest.main()
