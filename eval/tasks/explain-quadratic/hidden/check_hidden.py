"""Explain-only task: source files must be byte-identical to the originals."""
import hashlib
import sys

EXPECTED = {
    "events.py": "4e37a5521df3d00d208ced3c7eb1e9bc0a745ad236155067bc0203fa1888b5bc",
    "export.py": "5777fd142e7a0a44a876ca85726def1c93ae2ce06822cdaae1466ba42a2a1785"
}

bad = []
for path, digest in EXPECTED.items():
    try:
        actual = hashlib.sha256(open(path, "rb").read()).hexdigest()
    except FileNotFoundError:
        actual = None
    if actual != digest:
        bad.append(path)
if bad:
    print("modified:", ", ".join(bad))
    sys.exit(1)
print("sources unchanged")
