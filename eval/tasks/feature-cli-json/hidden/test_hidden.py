import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
STATS = os.path.join(HERE, "stats.py")

COUNT_KEYS = {"lines", "words"}
CHAR_KEYS = ("chars", "characters")


def run(*args, cwd):
    return subprocess.run(
        [sys.executable, STATS, *args], cwd=cwd, capture_output=True, text=True, timeout=20
    )


def stat_objects(node, key=None):
    """(object, key it was stored under) for every JSON object carrying counts."""
    found = []
    if isinstance(node, dict):
        if COUNT_KEYS <= node.keys() and any(k in node for k in CHAR_KEYS):
            found.append((node, key))
        for k, value in node.items():
            found.extend(stat_objects(value, k))
    elif isinstance(node, list):
        for value in node:
            found.extend(stat_objects(value, key))
    return found


def counts(obj):
    chars = next(obj[k] for k in CHAR_KEYS if k in obj)
    return (obj["lines"], obj["words"], chars)


def for_path(objs, path):
    """Objects describing `path`: path stored as a field, or used as the key."""
    return [o for o, key in objs if path in o.values() or key == path]


class CliHiddenTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = self.tmp.name
        with open(os.path.join(self.dir, "a.txt"), "w", encoding="utf-8") as f:
            f.write("hello world\nsecond line here\n")
        with open(os.path.join(self.dir, "b.txt"), "w", encoding="utf-8") as f:
            f.write("one\ntwo three\nfour\n")

    def tearDown(self):
        self.tmp.cleanup()

    def test_default_output_unchanged_single(self):
        r = run("a.txt", cwd=self.dir)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(r.stdout, "a.txt: 2 lines, 5 words, 29 chars\n")

    def test_default_output_unchanged_multiple(self):
        r = run("a.txt", "b.txt", cwd=self.dir)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(
            r.stdout,
            "a.txt: 2 lines, 5 words, 29 chars\n"
            "b.txt: 3 lines, 4 words, 19 chars\n"
            "total: 5 lines, 9 words, 48 chars\n",
        )

    def test_json_single_file(self):
        r = run("--json", "a.txt", cwd=self.dir)
        self.assertEqual(r.returncode, 0, r.stderr)
        doc = json.loads(r.stdout)
        objs = for_path(stat_objects(doc), "a.txt")
        self.assertEqual(len(objs), 1, r.stdout)
        self.assertEqual(counts(objs[0]), (2, 5, 29))

    def test_json_flag_after_files(self):
        r = run("a.txt", "--json", cwd=self.dir)
        self.assertEqual(r.returncode, 0, r.stderr)
        objs = for_path(stat_objects(json.loads(r.stdout)), "a.txt")
        self.assertEqual([counts(o) for o in objs], [(2, 5, 29)])

    def test_json_multiple_files(self):
        r = run("--json", "a.txt", "b.txt", cwd=self.dir)
        self.assertEqual(r.returncode, 0, r.stderr)
        objs = stat_objects(json.loads(r.stdout))
        a = for_path(objs, "a.txt")
        b = for_path(objs, "b.txt")
        self.assertEqual([counts(o) for o in a], [(2, 5, 29)], r.stdout)
        self.assertEqual([counts(o) for o in b], [(3, 4, 19)], r.stdout)

    def test_json_stdout_is_only_json(self):
        r = run("--json", "a.txt", "b.txt", cwd=self.dir)
        self.assertNotIn("lines,", r.stdout)
        json.loads(r.stdout)

    def test_missing_file_still_errors(self):
        r = run("--json", "nope.txt", cwd=self.dir)
        self.assertNotEqual(r.returncode, 0)


if __name__ == "__main__":
    unittest.main()
