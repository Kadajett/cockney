import unittest

from validators import is_valid_email, validate_signup


class ValidatorTests(unittest.TestCase):
    def test_normal_email(self):
        self.assertTrue(is_valid_email("alice@example.com"))

    def test_missing_at(self):
        self.assertFalse(is_valid_email("alice.example.com"))

    def test_signup_errors(self):
        self.assertEqual(validate_signup({"username": "x", "email": "nope"}), ["username", "email"])


if __name__ == "__main__":
    unittest.main()
