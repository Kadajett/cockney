"""Nightly export: python3 export.py events.csv"""
import json
import sys

from events import count_by_type, dedupe_events, load_events


def main(path):
    with open(path) as f:
        events = dedupe_events(load_events(f))
    print(json.dumps(count_by_type(events), sort_keys=True))


if __name__ == "__main__":
    main(sys.argv[1])
