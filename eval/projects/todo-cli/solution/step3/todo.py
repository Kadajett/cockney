import argparse
import json
import sys
from datetime import date

PATH = "todos.json"


def load():
    try:
        with open(PATH) as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save(todos):
    with open(PATH, "w") as f:
        json.dump(todos, f, indent=2)


def iso_date(s):
    try:
        return date.fromisoformat(s).isoformat()
    except ValueError:
        raise argparse.ArgumentTypeError(f"invalid date {s!r}, expected YYYY-MM-DD")


def line(i, t):
    due = f" (due {t['due']})" if t.get("due") else ""
    return f"{i}. [{'x' if t['done'] else ' '}] {t['text']}{due}"


def main():
    parser = argparse.ArgumentParser(prog="todo.py")
    sub = parser.add_subparsers(dest="cmd", required=True)
    add = sub.add_parser("add")
    add.add_argument("text")
    add.add_argument("--due", type=iso_date)
    sub.add_parser("list").add_argument("--overdue", action="store_true")
    sub.add_parser("done").add_argument("n", type=int)
    args = parser.parse_args()

    todos = load()
    if args.cmd == "add":
        todos.append({"text": args.text, "done": False, "due": args.due})
        save(todos)
        print(f"Added {len(todos)}: {args.text}")
    elif args.cmd == "list":
        today = date.today().isoformat()
        for i, t in enumerate(todos, 1):
            if args.overdue and (t["done"] or not t.get("due") or t["due"] >= today):
                continue
            print(line(i, t))
    elif args.cmd == "done":
        if not 1 <= args.n <= len(todos):
            sys.exit(f"error: no item {args.n}")
        todos[args.n - 1]["done"] = True
        save(todos)
        print(f"Done {args.n}: {todos[args.n - 1]['text']}")


if __name__ == "__main__":
    main()
