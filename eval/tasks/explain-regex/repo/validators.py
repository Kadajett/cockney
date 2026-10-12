"""Input validation for the signup form."""
import re

EMAIL_RE = re.compile(r"^[^@]+@[^@]+$")
USERNAME_RE = re.compile(r"^[a-z0-9_]{3,20}$")


def is_valid_email(value: str) -> bool:
    return bool(EMAIL_RE.match(value.strip()))


def is_valid_username(value: str) -> bool:
    return bool(USERNAME_RE.match(value))


def validate_signup(form: dict) -> list[str]:
    """Return the names of invalid fields (empty list = OK)."""
    errors = []
    if not is_valid_username(form.get("username", "")):
        errors.append("username")
    if not is_valid_email(form.get("email", "")):
        errors.append("email")
    return errors
