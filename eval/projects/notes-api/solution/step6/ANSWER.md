`save()` calls `writeFileSync(file, ...)` directly on notes.json. That opens the file with
truncation first and then writes the bytes, so if the process crashes (or the machine loses
power) in between, notes.json is left empty, truncated or half-written: partial JSON.

On the next start `JSON.parse(readFileSync(file))` throws, so the server refuses to boot
until someone fixes the file by hand, and every note that was in it is effectively lost
(the corrupt file is the only copy).

Fix: write atomically. Write the JSON to a temp file next to it (e.g. `notes.json.tmp`),
optionally fsync it, then `renameSync(tmp, file)`. Rename is atomic on the same
filesystem, so readers see either the old complete file or the new complete file, never a
partial one.
