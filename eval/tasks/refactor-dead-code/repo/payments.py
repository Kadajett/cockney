"""Payment gateway client (stubbed; the real one lives in the infra repo)."""


def charge(customer_id, amount_pence):
    if amount_pence <= 0:
        raise ValueError("amount must be positive")
    return {"customer": customer_id, "amount_pence": amount_pence, "status": "ok"}
