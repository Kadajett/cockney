It's quadratic — O(n^2). `seen_list` is a plain list, and `e["id"] not in seen_list` does a linear scan of every id seen so far. With ~200k mostly-unique events that's roughly n²/2 ≈ 2×10^10 comparisons, hence minutes.

Fix (when you want it): make `seen` a `set` (O(1) average membership), or use a dict keyed by id (`dict.fromkeys` style) to keep first-occurrence order. That makes the whole function O(n). Nothing changed yet.
