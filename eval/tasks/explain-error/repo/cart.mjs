// Shopping cart model shared by the checkout service.
export class Cart {
  constructor(customerId) {
    this.customerId = customerId;
    this.items = [];
    this._total = 0;
  }

  add(sku, price, qty = 1) {
    this.items.push({ sku, price, qty });
    this._total += price * qty;
  }

  get total() {
    return this.total;
  }

  get count() {
    return this.items.reduce((n, item) => n + item.qty, 0);
  }
}
