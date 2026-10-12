# shop-invoicing

Builds plain-text invoices for the shop. Prices are in dollars with at most two
decimal places. Sales tax is 7.5% of the subtotal, rounded half-up to the
nearest cent; the total is subtotal + tax. All amounts are shown with exactly two decimals.

Run the tests with `npm test`.
