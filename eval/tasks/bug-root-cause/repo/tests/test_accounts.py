import unittest

from accounts.invite import accept_invite, create_invite
from accounts.login import login
from accounts.signup import signup
from accounts.store import AccountError, Store


class AccountFlowTests(unittest.TestCase):
    def setUp(self):
        self.store = Store()

    def test_signup_then_login(self):
        signup(self.store, "ann@example.com", "correct horse")
        self.assertEqual(login(self.store, "ann@example.com", "correct horse"), "ann@example.com")

    def test_wrong_password(self):
        signup(self.store, "ann@example.com", "correct horse")
        with self.assertRaises(AccountError):
            login(self.store, "ann@example.com", "battery staple")

    def test_invite_flow(self):
        token = create_invite(self.store, "cat@example.com", invited_by="ann@example.com")
        accept_invite(self.store, token, "cat@example.com", "s3cret-pass")
        self.assertEqual(login(self.store, "cat@example.com", "s3cret-pass"), "cat@example.com")

    def test_invalid_email(self):
        with self.assertRaises(ValueError):
            signup(self.store, "not-an-email", "correct horse")


if __name__ == "__main__":
    unittest.main()
