Cause: infinite recursion in the `get total()` getter in `cart.mjs` (line 15). It does `return this.total;` — but `this.total` *is* the getter, so it calls itself forever until V8 blows the stack (`RangeError: Maximum call stack size exceeded`, every frame is `get total`). Any `checkout()` that reads `cart.total` crashes the process.

Fix: return the backing field that `add()` actually updates:

```js
get total() {
  return this._total;
}
```
