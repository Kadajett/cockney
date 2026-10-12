"""Small text helpers used by the blog."""
import re
_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def slugify(s: str) -> str:
    """'Hello, World!' -> 'hello-world'"""
    return _NON_ALNUM.sub("-", s.lower()).strip("-")


def truncate(s: str, limit: int = 80) -> str:
    """Cut s to at most `limit` characters, ending with an ellipsis if shortened."""
    if len(s) <= limit:
        return s
    return s[: limit - 1].rstrip() + "…"
