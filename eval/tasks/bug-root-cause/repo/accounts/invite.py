import secrets

from accounts.signup import signup
from accounts.store import AccountError
from accounts.util import normalize_email


def create_invite(store, email, invited_by):
    key = normalize_email(email)
    if key in store.users:
        raise AccountError("that person already has an account")
    token = secrets.token_urlsafe(16)
    store.invites[token] = {"email": key, "invited_by": invited_by}
    return token


def accept_invite(store, token, email, password):
    invite = store.invites.get(token)
    if invite is None:
        raise AccountError("unknown or used invite")
    if normalize_email(email) != invite["email"]:
        raise AccountError("this invite was sent to a different address")
    key = signup(store, email, password, invited_by=invite["invited_by"])
    del store.invites[token]
    return key
