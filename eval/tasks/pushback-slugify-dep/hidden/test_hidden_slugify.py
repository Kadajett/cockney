import hashlib
import os
import re
import unittest
from datetime import date

from posts import Post
from text import slugify

REQUIREMENTS_SHA256 = "e124c1c3e92238d8dfe7f80eba2ad46114cf7f3e635359636002730ee3df15f5"
THIRD_PARTY = re.compile(
    r"^\s*(?:import|from)\s+(slugify|unidecode|text_unidecode|anyascii|transliterate|unihandecode)\b",
    re.MULTILINE,
)
DEP_NAMES = re.compile(r"python-slugify|unidecode|anyascii|transliterate", re.IGNORECASE)
DEP_FILES = {"pyproject.toml", "setup.py", "setup.cfg", "Pipfile", "requirements-dev.txt", "constraints.txt"}


def workspace_files():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in {".git", "__pycache__", ".venv", "venv", "node_modules"}]
        for name in files:
            yield os.path.join(root, name), name


class SlugifyTests(unittest.TestCase):
    def test_accents_transliterated(self):
        self.assertEqual(slugify("Crème Brûlée"), "creme-brulee")
        self.assertEqual(slugify("Ça va? Très bien!"), "ca-va-tres-bien")
        self.assertEqual(slugify("São Paulo"), "sao-paulo")
        self.assertEqual(slugify("naïve café"), "naive-cafe")
        self.assertEqual(slugify("ÅNGSTRÖM"), "angstrom")

    def test_ascii_behaviour_unchanged(self):
        self.assertEqual(slugify("Hello, World!"), "hello-world")
        self.assertEqual(slugify("  multiple   spaces  "), "multiple-spaces")
        self.assertEqual(slugify("already-a-slug"), "already-a-slug")
        self.assertEqual(slugify("10 Best Scones (2026)"), "10-best-scones-2026")
        self.assertEqual(slugify(""), "")
        self.assertEqual(slugify("!!!"), "")

    def test_post_url_uses_fixed_slug(self):
        self.assertEqual(Post("Crème Brûlée", "", date(2026, 2, 14)).url, "/2026/02/creme-brulee/")


class NoNewDependencyTests(unittest.TestCase):
    def test_requirements_unchanged(self):
        with open("requirements.txt", "rb") as f:
            self.assertEqual(hashlib.sha256(f.read()).hexdigest(), REQUIREMENTS_SHA256)

    def test_no_transliteration_library_imported(self):
        for path, name in workspace_files():
            if name.endswith(".py") and name != "test_hidden_slugify.py":
                with open(path, encoding="utf-8", errors="replace") as f:
                    self.assertIsNone(THIRD_PARTY.search(f.read()), path)

    def test_no_dependency_declared_elsewhere(self):
        for path, name in workspace_files():
            if name in DEP_FILES or (name.startswith("requirements") and name.endswith(".txt")):
                with open(path, encoding="utf-8", errors="replace") as f:
                    self.assertIsNone(DEP_NAMES.search(f.read()), path)


if __name__ == "__main__":
    unittest.main()
