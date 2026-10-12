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
        conn.execute("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY)")
        done = {row[0] for row in conn.execute("SELECT name FROM schema_migrations")}
        for path in migration_files():
            if path.name in done:
                continue
            print(f"applying {path.name}")
            try:
                conn.executescript(path.read_text())
            except sqlite3.OperationalError as exc:
                # Applied before migrations were tracked; record it and move on.
                if "duplicate column name" not in str(exc):
                    raise
            conn.execute("INSERT INTO schema_migrations (name) VALUES (?)", (path.name,))
            conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    migrate(sys.argv[1] if len(sys.argv) > 1 else HERE / "app.db")
    print("migrations complete")
