import unittest

from events import count_by_type, dedupe_events, load_events


class EventsTests(unittest.TestCase):
    def test_dedupe_keeps_first(self):
        events = load_events(["a,click,1", "b,view,2", "a,click,3"])
        self.assertEqual([e["ts"] for e in dedupe_events(events)], [1, 2])

    def test_count(self):
        events = load_events(["a,click,1", "b,view,2", "c,click,3"])
        self.assertEqual(count_by_type(events)["click"], 2)


if __name__ == "__main__":
    unittest.main()
