import pathlib
import sqlite3
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parent

ORIGINAL_USERS = [
    (1, "Ada Lovelace", "ada@example.com"),
    (2, "Grace Hopper", "grace@example.com"),
    (3, "Alan Turing", None),
    (4, "Margaret Hamilton", "margaret@example.com"),
    (5, "Edsger Dijkstra", "edsger@example.com"),
]


def run_migrate(*args):
    return subprocess.run(
        [sys.executable, "migrate.py", *args],
        cwd=ROOT, capture_output=True, text=True, timeout=20,
    )


def columns(db_path):
    conn = sqlite3.connect(db_path)
    try:
        return {row[1] for row in conn.execute("PRAGMA table_info(users)")}
    finally:
        conn.close()


class HiddenMigrationTest(unittest.TestCase):
    def test_existing_db_migrates_and_keeps_data(self):
        db = ROOT / "app.db"
        self.assertTrue(db.exists(), "app.db is gone")
        for attempt in (1, 2):
            proc = run_migrate()
            self.assertEqual(proc.returncode, 0, f"run {attempt} failed:\n{proc.stdout}\n{proc.stderr}")
        conn = sqlite3.connect(db)
        try:
            rows = conn.execute("SELECT id, name, email FROM users ORDER BY id").fetchall()
        finally:
            conn.close()
        self.assertEqual(rows, ORIGINAL_USERS)
        self.assertLessEqual({"email", "last_login"}, columns(db))

    def test_fresh_db_gets_full_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            db = pathlib.Path(tmp) / "fresh.db"
            for attempt in (1, 2):
                proc = run_migrate(str(db))
                self.assertEqual(proc.returncode, 0, f"run {attempt} failed:\n{proc.stdout}\n{proc.stderr}")
            self.assertLessEqual({"id", "name", "email", "last_login"}, columns(db))


if __name__ == "__main__":
    unittest.main()
