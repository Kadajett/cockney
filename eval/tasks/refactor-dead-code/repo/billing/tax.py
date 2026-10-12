"""VAT / sales-tax rates by region."""

RATES = {"UK": 0.20, "IE": 0.23, "DE": 0.19, "US": 0.0}


def tax_rate_for(region: str) -> float:
    try:
        return RATES[region]
    except KeyError:
        raise ValueError(f"unsupported region: {region}") from None


def apply_tax(net_pence: int, region: str) -> int:
    """Gross amount in pence, rounded half-up to the nearest penny."""
    return int(net_pence * (1 + tax_rate_for(region)) + 0.5)
