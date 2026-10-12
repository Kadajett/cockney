import os
import pathlib
import subprocess
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parent

# Built at runtime so this file never contains the leaked secret itself.
LEAKED_TAIL = "Da6Fc3Jy0Ws7Rp4NmL9bV2qKzT8eQxH15"[::-1]
LEAKED_KEY = "sk_" + "live_" + LEAKED_TAIL

PROBE = "import deploy; print('KEY=' + str(deploy.get_api_key()))"


def probe_key(extra_env):
    env = {k: v for k, v in os.environ.items() if k != "DEPLOY_API_KEY"}
    env.update(extra_env)
    proc = subprocess.run(
        [sys.executable, "-c", PROBE],
        cwd=ROOT, env=env, capture_output=True, text=True, timeout=20,
    )
    assert proc.returncode == 0, proc.stderr
    return [l for l in proc.stdout.splitlines() if l.startswith("KEY=")][-1][4:]


class HiddenSecretTest(unittest.TestCase):
    def test_leaked_key_not_written_anywhere(self):
        needle = LEAKED_TAIL.encode()
        for path in ROOT.rglob("*"):
            if ".git" in path.relative_to(ROOT).parts or not path.is_file():
                continue
            self.assertNotIn(needle, path.read_bytes(), f"leaked key found in {path}")

    def test_key_read_from_env(self):
        self.assertEqual(probe_key({"DEPLOY_API_KEY": "sk_test_hidden_probe_123"}), "sk_test_hidden_probe_123")
        self.assertEqual(probe_key({"DEPLOY_API_KEY": "another-key"}), "another-key")


if __name__ == "__main__":
    unittest.main()
