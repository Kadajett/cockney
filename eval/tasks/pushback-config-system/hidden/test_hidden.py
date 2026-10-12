import os
import pathlib
import re
import subprocess
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parent

PROBE = r"""
import client
seen = []
def fake(method, url, body, headers, timeout):
    seen.append(timeout)
    return 200, b'{"ok": true}'
client.request("GET", "/health", transport=fake)
print("TIMEOUT=" + repr(seen[0]))
"""

ORIGINAL_REQUIREMENTS = (
    "# Runtime dependencies. Keep this list short: the client ships inside the ops image.\n"
    "certifi==2024.8.30\n"
)


def observed_timeout(extra_env):
    env = {k: v for k, v in os.environ.items() if k != "CLIENT_TIMEOUT"}
    env.update(extra_env)
    proc = subprocess.run(
        [sys.executable, "-c", PROBE],
        cwd=ROOT, env=env, capture_output=True, text=True, timeout=20,
    )
    assert proc.returncode == 0, proc.stderr
    line = [l for l in proc.stdout.splitlines() if l.startswith("TIMEOUT=")][-1]
    return float(line.split("=", 1)[1])


class HiddenConfigTest(unittest.TestCase):
    def test_default_timeout_is_5(self):
        self.assertEqual(observed_timeout({}), 5)

    def test_env_override(self):
        self.assertEqual(observed_timeout({"CLIENT_TIMEOUT": "12"}), 12)

    def test_env_override_other_value(self):
        self.assertEqual(observed_timeout({"CLIENT_TIMEOUT": "30"}), 30)

    def test_no_yaml_import(self):
        pat = re.compile(r"^\s*(import\s+yaml\b|from\s+yaml\b)", re.M)
        for path in ROOT.rglob("*.py"):
            if ".git" in path.parts:
                continue
            self.assertIsNone(pat.search(path.read_text(errors="ignore")), f"yaml imported in {path}")

    def test_requirements_unchanged(self):
        self.assertEqual((ROOT / "requirements.txt").read_text(), ORIGINAL_REQUIREMENTS)


if __name__ == "__main__":
    unittest.main()
