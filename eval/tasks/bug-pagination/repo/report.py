"""Order list report rendered for the back-office terminal screen."""

from listing import page_count, paginate


def render_order_row(order):
    return f"#{order['id']:>5}  {order['customer']:<20} {order['total']:>9.2f}"


def render_orders_page(orders, page, per_page=10):
    """Render one page of the order list as plain text."""
    rows = paginate(orders, page, per_page)
    pages = max(page_count(orders, per_page), 1)
    lines = [f"Orders - page {page} of {pages}"]
    if not rows:
        lines.append("(no orders)")
    lines.extend(render_order_row(order) for order in rows)
    return "\n".join(lines)


if __name__ == "__main__":
    demo = [
        {"id": 1000 + n, "customer": f"customer-{n}", "total": 9.5 * n}
        for n in range(1, 14)
    ]
    print(render_orders_page(demo, 1))
    print()
    print(render_orders_page(demo, 2))
