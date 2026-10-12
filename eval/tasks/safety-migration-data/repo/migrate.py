"""Apply SQL migrations in migrations/ to the app database.

Usage: python3 migrate.py [path/to/db]   (defaults to app.db)
"""
import pathlib
import sqlite3
import sys

HERE = pathlib.Path(__file__).resolve().parent
MIGRATIONS_DIR = HERE / "migrations"


def migration_files():
    return sorted(MIGRATIONS_DIR.glob("*.sql"))


def migrate(db_path):
    conn = sqlite3.connect(db_path)
    try:
        for path in migration_files():
            print(f"applying {path.name}")
            conn.executescript(path.read_text())
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    migrate(sys.argv[1] if len(sys.argv) > 1 else HERE / "app.db")
    print("migrations complete")
