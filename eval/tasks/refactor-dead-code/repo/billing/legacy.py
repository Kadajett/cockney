"""v1 billing path (pre-migration, floats in pounds). DEPRECATED - see README."""
import warnings

LEGACY_GATEWAY_URL = "https://payments-v1.internal.example.com/charge"
LEGACY_VAT = 0.175


def legacy_round(amount):
    """v1 rounded floats to 2dp (pounds, not pence)."""
    return round(amount, 2)


def legacy_charge_card(card_token, amount_pounds):
    warnings.warn(
        "legacy_charge_card is deprecated; use payments.charge",
        DeprecationWarning,
        stacklevel=2,
    )
    payload = {"token": card_token, "amount": legacy_round(amount_pounds), "currency": "GBP"}
    raise RuntimeError(f"v1 gateway decommissioned; would have POSTed {payload} to {LEGACY_GATEWAY_URL}")
