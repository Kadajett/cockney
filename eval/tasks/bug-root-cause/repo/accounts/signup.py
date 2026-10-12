from accounts.store import AccountError
from accounts.util import hash_password, normalize_email


def signup(store, email, password, invited_by=None):
    key = normalize_email(email)
    if key in store.users:
        raise AccountError("an account with that email already exists")
    if len(password) < 8:
        raise AccountError("password must be at least 8 characters")
    salt, digest = hash_password(password)
    store.users[key] = {"salt": salt, "digest": digest, "invited_by": invited_by}
    return key
