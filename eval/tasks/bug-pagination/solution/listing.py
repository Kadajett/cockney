"""Helpers for listing and paging collections in back-office reports."""


def page_count(items, per_page=20):
    """Number of pages needed to show `items`, `per_page` at a time."""
    if per_page < 1:
        raise ValueError("per_page must be >= 1")
    return (len(items) + per_page - 1) // per_page


def paginate(items, page, per_page=20):
    """Return the items shown on 1-based `page`, `per_page` items per page.

    Pages past the end are empty.
    """
    if page < 1:
        raise ValueError("page must be >= 1")
    if per_page < 1:
        raise ValueError("per_page must be >= 1")
    start = (page - 1) * per_page
    end = start + per_page
    return items[start:end]
