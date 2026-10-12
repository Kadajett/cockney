# textstats

A tiny `wc`-style tool: `python3 stats.py FILE [FILE ...]` prints line, word and
character counts per file, plus a total when given several files.
`--json` prints a JSON list of `{path, lines, words, chars}` objects instead.
Run the tests with `python3 -m unittest`.
