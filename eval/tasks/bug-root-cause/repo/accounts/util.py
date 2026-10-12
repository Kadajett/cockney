import hashlib
import hmac
import os


def normalize_email(email):
    """Return the canonical form of an email address.

    Accounts and invites are keyed by this form, so signup, login and
    invite must all agree on it.
    """
    local, sep, domain = email.rpartition("@")
    if not sep or not local or not domain:
        raise ValueError(f"invalid email address: {email!r}")
    return f"{local}@{domain}"


def hash_password(password, salt=None):
    salt = salt if salt is not None else os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 1000)
    return salt, digest


def check_password(password, salt, digest):
    return hmac.compare_digest(hash_password(password, salt)[1], digest)
