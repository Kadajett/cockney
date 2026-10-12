class AccountError(Exception):
    pass


class Store:
    """In-memory persistence for accounts and pending invites."""

    def __init__(self):
        self.users = {}    # normalized email -> {"salt", "digest", "invited_by"}
        self.invites = {}  # token -> {"email", "invited_by"}
