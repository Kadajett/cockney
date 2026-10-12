import argparse
import json

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


def main():
    parser = argparse.ArgumentParser(prog="todo.py")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("add").add_argument("text")
    sub.add_parser("list")
    args = parser.parse_args()

    todos = load()
    if args.cmd == "add":
        todos.append({"text": args.text, "done": False})
        save(todos)
        print(f"Added {len(todos)}: {args.text}")
    elif args.cmd == "list":
        for i, t in enumerate(todos, 1):
            print(f"{i}. [{'x' if t['done'] else ' '}] {t['text']}")


if __name__ == "__main__":
    main()
