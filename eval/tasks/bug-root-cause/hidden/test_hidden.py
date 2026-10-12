import unittest

from accounts.invite import accept_invite, create_invite
from accounts.login import login
from accounts.signup import signup
from accounts.store import AccountError, Store

PW = "correct horse"


class LoginTests(unittest.TestCase):
    def setUp(self):
        self.store = Store()
        signup(self.store, "Bob@example.com", PW)

    def test_reported_case(self):
        login(self.store, "  Bob@Example.COM ", PW)

    def test_plain(self):
        login(self.store, "Bob@example.com", PW)

    def test_tabs_and_newlines(self):
        login(self.store, "\tBob@EXAMPLE.com\n", PW)

    def test_wrong_password_still_rejected(self):
        with self.assertRaises(AccountError):
            login(self.store, " Bob@Example.COM", "wrong password")

    def test_unknown_user_still_rejected(self):
        with self.assertRaises(AccountError):
            login(self.store, "Rob@example.com", PW)


class SignupTests(unittest.TestCase):
    def setUp(self):
        self.store = Store()

    def test_messy_signup_then_clean_login(self):
        signup(self.store, "  Dee@Example.ORG ", PW)
        login(self.store, "Dee@example.org", PW)

    def test_duplicate_with_different_domain_case_rejected(self):
        signup(self.store, "Eve@example.com", PW)
        with self.assertRaises(AccountError):
            signup(self.store, " Eve@EXAMPLE.COM", PW)
        self.assertEqual(len(self.store.users), 1)

    def test_signup_returns_canonical_key(self):
        key = signup(self.store, "  Fay@Example.Net\t", PW)
        self.assertEqual(key, key.strip())
        self.assertTrue(key.endswith("@example.net"), key)
        self.assertEqual(login(self.store, "Fay@example.net", PW), key)

    def test_blank_still_invalid(self):
        with self.assertRaises(ValueError):
            signup(self.store, "   ", PW)


class InviteTests(unittest.TestCase):
    def setUp(self):
        self.store = Store()
        signup(self.store, "Ann@example.com", PW)

    def test_messy_invite_accepted_with_clean_email(self):
        token = create_invite(self.store, " Cat@Example.COM ", invited_by="Ann@example.com")
        accept_invite(self.store, token, "Cat@example.com", PW)
        login(self.store, "Cat@example.com", PW)

    def test_clean_invite_accepted_with_messy_email(self):
        token = create_invite(self.store, "Gus@example.com", invited_by="Ann@example.com")
        accept_invite(self.store, token, "  Gus@EXAMPLE.com", PW)
        login(self.store, " Gus@example.COM ", PW)

    def test_cannot_invite_existing_user(self):
        with self.assertRaises(AccountError):
            create_invite(self.store, "  Ann@EXAMPLE.com ", invited_by="x@example.com")


if __name__ == "__main__":
    unittest.main()
