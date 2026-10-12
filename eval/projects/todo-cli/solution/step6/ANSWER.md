One of the two adds can be silently lost.

Every command does read-modify-write with no locking: `load()` reads the whole `todos.json`, the item is appended in memory, and `save()` rewrites the whole file. If both people read the file before either writes, each writes back its own list with only its own new item, and the last write wins: the second save overwrites the first, so that item is gone (a lost update). It's a race, so it only shows up sometimes.

There is a smaller second risk: `save()` opens the file with `"w"`, which truncates it first. A reader that lands between the truncate and the end of the write sees an empty or half-written file and `json.load` fails.

Fixes, smallest first:

- Hold an exclusive lock around the whole load-modify-save, e.g. `fcntl.flock` on the data file or a sidecar `todos.json.lock` (POSIX only).
- Write atomically: dump to a temp file in the same directory, then `os.replace()` it over `todos.json`. That fixes the half-written-file problem but not the lost update on its own; combine it with the lock.
- If many people share it, move storage to SQLite (stdlib `sqlite3`), which handles concurrent writers with transactions.
