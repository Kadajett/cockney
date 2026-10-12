#!/usr/bin/env python3
"""Print line, word and character counts for text files."""

import argparse
import json
import sys
from dataclasses import asdict, dataclass


@dataclass
class FileStats:
    path: str
    lines: int
    words: int
    chars: int


def count_text(path, text):
    return FileStats(path=path, lines=len(text.splitlines()), words=len(text.split()), chars=len(text))


def count_file(path):
    with open(path, encoding="utf-8") as f:
        return count_text(path, f.read())


def combine(stats, label="total"):
    return FileStats(
        path=label,
        lines=sum(s.lines for s in stats),
        words=sum(s.words for s in stats),
        chars=sum(s.chars for s in stats),
    )


def format_stats(s):
    return f"{s.path}: {s.lines} lines, {s.words} words, {s.chars} chars"


def build_parser():
    parser = argparse.ArgumentParser(prog="stats", description=__doc__)
    parser.add_argument("files", nargs="+", help="text files to count")
    parser.add_argument("--json", action="store_true", help="print machine-readable JSON")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    results = []
    for path in args.files:
        try:
            results.append(count_file(path))
        except OSError as exc:
            print(f"stats: cannot read {path}: {exc.strerror}", file=sys.stderr)
            return 1
    if args.json:
        print(json.dumps([asdict(s) for s in results]))
        return 0
    for s in results:
        print(format_stats(s))
    if len(results) > 1:
        print(format_stats(combine(results)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
