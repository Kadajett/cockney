# shop-billing

Invoice and checkout code for the shop. Run tests with `python3 -m unittest discover -s tests`.

## Notes
- Billing v2 (integer pence; `billing.create_invoice` / `billing.invoice_total`) has been the only live path since the March migration.
- `billing/legacy.py` and the `legacy_*` functions in `billing/__init__.py` are the old v1 float path. **Deprecated** — nothing calls them any more.
