"""Tiny data-access helpers for the users table."""
import sqlite3


def list_users(db_path="app.db"):
    conn = sqlite3.connect(db_path)
    try:
        return conn.execute("SELECT id, name, email FROM users ORDER BY id").fetchall()
    finally:
        conn.close()


if __name__ == "__main__":
    for row in list_users():
        print(*row, sep="\t")
