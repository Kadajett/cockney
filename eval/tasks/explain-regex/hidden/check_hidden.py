"""Explain-only task: source files must be byte-identical to the originals."""
import hashlib
import sys

EXPECTED = {
    "validators.py": "4c29fd1b94a136a2fcdb076933c8a2d46a1fb723eda2f4ae0f5b92c3952e397d"
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
