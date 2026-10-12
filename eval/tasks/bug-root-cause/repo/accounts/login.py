from accounts.store import AccountError
from accounts.util import check_password, normalize_email


def login(store, email, password):
    """Return the account key on success, raise AccountError otherwise."""
    key = normalize_email(email)
    user = store.users.get(key)
    if user is None or not check_password(password, user["salt"], user["digest"]):
        raise AccountError("invalid email or password")
    return key
