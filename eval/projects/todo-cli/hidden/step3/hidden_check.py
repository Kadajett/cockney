"""Hidden behaviour check for the todo-cli project.

Usage: python3 hidden_check.py STEP
Runs todo.py as a subprocess in a temp dir; never imports the agent's code.
"""

import ast
import csv
import datetime
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

STEP = int(sys.argv.pop(1))
ROOT = Path(__file__).resolve().parent
TODO = ROOT / "todo.py"
SKIP_DIRS = {"node_modules", "__pycache__", "site-packages", "venv", "env"}


class TodoCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self._tmp.name)
        self.env = {k: v for k, v in os.environ.items() if k != "TODO_FILE"}

    def tearDown(self):
        self._tmp.cleanup()

    def todo(self, *args, env=None):
        return subprocess.run(
            [sys.executable, str(TODO), *args],
            cwd=self.dir,
            env=env or self.env,
            capture_output=True,
            text=True,
            timeout=15,
        )

    def ok(self, *args, env=None):
        r = self.todo(*args, env=env)
        self.assertEqual(r.returncode, 0, f"todo.py {' '.join(args)} failed:\n{r.stdout}{r.stderr}")
        return r

    def fails(self, *args, env=None):
        r = self.todo(*args, env=env)
        self.assertNotEqual(r.returncode, 0, f"todo.py {' '.join(args)} should fail, got:\n{r.stdout}")
        self.assertTrue(r.stderr.strip(), f"todo.py {' '.join(args)}: expected an error on stderr")
        return r

    def lines(self, *args, env=None):
        out = self.ok("list", *args, env=env).stdout
        return [l.rstrip() for l in out.splitlines() if l.strip()]


class Step1(TodoCase):
    def test_empty_list_prints_nothing(self):
        self.assertEqual(self.ok("list").stdout.strip(), "")

    def test_add_and_list_persist_in_cwd(self):
        self.ok("add", "buy milk")
        self.ok("add", "walk the dog")
        self.assertEqual(self.lines(), ["1. [ ] buy milk", "2. [ ] walk the dog"])
        self.assertTrue((self.dir / "todos.json").is_file(), "todos.json not created in cwd")


@unittest.skipUnless(STEP >= 2, "step 2+")
class Step2(TodoCase):
    def test_done_marks_item(self):
        for t in ("a", "b", "c"):
            self.ok("add", t)
        self.ok("done", "2")
        self.assertEqual(self.lines(), ["1. [ ] a", "2. [x] b", "3. [ ] c"])

    def test_bad_number_errors_and_changes_nothing(self):
        self.ok("add", "a")
        for n in ("0", "2", "x", "-1"):
            self.fails("done", n)
        self.assertEqual(self.lines(), ["1. [ ] a"])


@unittest.skipUnless(STEP >= 3, "step 3+")
class Step3(TodoCase):
    def test_due_shown_in_list(self):
        self.ok("add", "pay rent", "--due", "2026-11-01")
        self.ok("add", "plain")
        self.assertEqual(self.lines(), ["1. [ ] pay rent (due 2026-11-01)", "2. [ ] plain"])

    def test_bad_due_rejected(self):
        for d in ("2026-13-01", "tomorrow", "01/11/2026"):
            self.fails("add", "x", "--due", d)
        self.assertEqual(self.lines(), [])

    @unittest.skipUnless(STEP < 7, "--overdue removed in step 7")
    def test_overdue_filter(self):
        today = datetime.date.today().isoformat()
        self.ok("add", "old", "--due", "2000-01-01")
        self.ok("add", "future", "--due", "2999-12-31")
        self.ok("add", "no date")
        self.ok("add", "old but done", "--due", "2000-02-02")
        self.ok("add", "due today", "--due", today)
        self.ok("done", "4")
        self.assertEqual(self.lines("--overdue"), ["1. [ ] old (due 2000-01-01)"])
        self.assertEqual(len(self.lines()), 5)

    def test_stdlib_only(self):
        local, files = set(), []
        for p in ROOT.rglob("*"):
            parts = p.relative_to(ROOT).parts
            if any(x.startswith(".") or x in SKIP_DIRS for x in parts):
                continue
            if p.is_dir():
                local.add(p.name)
            elif p.suffix == ".py":
                local.add(p.stem)
                name = p.name
                is_test = name.startswith("test") or name.endswith("_test.py") or name == "conftest.py" or "tests" in parts
                if name != "hidden_check.py" and not is_test:
                    files.append(p)
        bad = set()
        for f in files:
            for node in ast.walk(ast.parse(f.read_text(), str(f))):
                mods = []
                if isinstance(node, ast.Import):
                    mods = [a.name for a in node.names]
                elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
                    mods = [node.module]
                elif isinstance(node, ast.Call) and node.args and isinstance(node.args[0], ast.Constant):
                    fn = node.func
                    fname = fn.id if isinstance(fn, ast.Name) else getattr(fn, "attr", "")
                    if fname in ("__import__", "import_module") and isinstance(node.args[0].value, str):
                        mods = [node.args[0].value]
                for m in mods:
                    top = m.split(".")[0]
                    if top not in sys.stdlib_module_names and top not in local:
                        bad.add(f"{f.relative_to(ROOT)}: {m}")
        self.assertFalse(bad, f"third-party imports: {sorted(bad)}")


@unittest.skipUnless(STEP >= 4, "step 4+")
class Step4(TodoCase):
    def test_export_csv(self):
        self.ok("add", "Buy milk, eggs", "--due", "2026-11-01")
        self.ok("add", 'He said "hi", then left')
        self.ok("add", "plain")
        self.ok("done", "2")
        self.ok("export", "out.csv")
        # The prompt asks for Excel compatibility, so a UTF-8 BOM is a legitimate choice.
        with open(self.dir / "out.csv", newline="", encoding="utf-8-sig") as f:
            rows = list(csv.reader(f))
        self.assertEqual(
            rows,
            [
                ["id", "text", "done", "due"],
                ["1", "Buy milk, eggs", "false", "2026-11-01"],
                ["2", 'He said "hi", then left', "true", ""],
                ["3", "plain", "false", ""],
            ],
        )


@unittest.skipUnless(STEP >= 5, "step 5+")
class Step5(TodoCase):
    def test_todo_file_absolute(self):
        (self.dir / "elsewhere").mkdir()
        target = self.dir / "elsewhere" / "mine.json"
        env = {**self.env, "TODO_FILE": str(target)}
        self.ok("add", "shared", env=env)
        self.assertEqual(self.lines(env=env), ["1. [ ] shared"])
        self.assertTrue(target.is_file(), "TODO_FILE path not written")
        self.assertFalse((self.dir / "todos.json").exists(), "wrote ./todos.json despite TODO_FILE")
        self.assertEqual(self.lines(), [])

    def test_todo_file_relative(self):
        (self.dir / "data").mkdir()
        env = {**self.env, "TODO_FILE": "data/rel.json"}
        self.ok("add", "rel", env=env)
        self.ok("done", "1", env=env)
        self.assertTrue((self.dir / "data" / "rel.json").is_file())
        self.assertEqual(self.lines(env=env), ["1. [x] rel"])


@unittest.skipUnless(STEP >= 7, "step 7+")
class Step7(TodoCase):
    def test_overdue_flag_gone(self):
        self.ok("add", "old", "--due", "2000-01-01")
        self.fails("list", "--overdue")
        self.assertEqual(self.lines(), ["1. [ ] old (due 2000-01-01)"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
