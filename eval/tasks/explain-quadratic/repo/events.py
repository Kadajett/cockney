"""Event-stream helpers for the nightly analytics export."""
from collections import Counter


def load_events(lines):
    """Parse 'id,type,ts' CSV lines into dicts, skipping blank lines."""
    events = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        event_id, kind, ts = line.split(",")
        events.append({"id": event_id, "type": kind, "ts": int(ts)})
    return events


def dedupe_events(events):
    """Drop events whose id was already seen, keeping first-occurrence order.

    FIXME: takes several minutes on the ~200k-event nightly export.
    """
    seen_list = []
    unique = []
    for e in events:
        if e["id"] not in seen_list:
            seen_list.append(e["id"])
            unique.append(e)
    return unique


def count_by_type(events):
    """Return a Counter of event type -> occurrences."""
    return Counter(e["type"] for e in events)
