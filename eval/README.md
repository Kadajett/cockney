# Eval harness

Same tasks, same headless agent, different appended system prompt. Every run is scored on what it leaves behind.

```bash
node eval/src/validate.ts                      # every check fails on the untouched repo and passes with solution/
node eval/src/audit.ts sonnet                  # each arm's ruleset reaches the model; baseline carries none
node eval/src/run.ts --batch NAME --model sonnet --reps 5 [--arms all] [--tasks all|dev|test|id,id]
node eval/src/judge.ts --batch NAME            # blinded judge (opus) over each (task, rep) group
node eval/src/report.ts --batch NAME [--split dev|test] [--ref baseline|concise]
node eval/src/project.ts --batch NAME --model sonnet --reps 4   # multi-step builds, one session each
node eval/src/project-report.ts --batch NAME
```

Needs `omp` logged in to Anthropic and/or OpenAI Codex. Models: `haiku` (claude-haiku-4-5), `sonnet` (claude-sonnet-5-5), `opus` (claude-opus-5-5), `codex` (gpt-5.6-terra). Any other provider aborts the run: each record lists the providers that served it, and the overlay disables `openrouter`.

## Arms

| arm | appended to the system prompt |
|---|---|
| `baseline` | nothing |
| `concise` | `Answer concisely.` (the control caveman's own evals use) |
| `caveman` | caveman `skills/caveman/SKILL.md`, vendored at the commit in `arms/SOURCES.txt` |
| `ponytail` | ponytail `skills/ponytail/SKILL.md`, filtered to `full` the way its hook does |
| `cockney-lite/full/guvnor` | `hooks/ruleset.ts` output for that level, the same text the hooks inject |

## A run

1. Copy `tasks/<id>/repo/` to `/tmp/cockney-eval/<batch>/<key>`, `git init`, commit.
2. `omp -p --mode json` with `--no-skills --no-rules --no-extensions --no-lsp`, tools `read,bash,edit,write,grep,glob`, thinking `medium`, and an overlay that disables the user's own `AGENTS.md`/`CLAUDE.md`. The prompt goes in on stdin, and each run gets its own PID namespace (`bwrap --unshare-pid`) when bwrap exists. Without that, an agent's `pkill -f server.mjs` killed sibling runs whose argv held the same words.
3. Count the diff against the initial commit: added non-blank, non-comment lines (ponytail's `loc.js` rule).
4. Copy `tasks/<id>/hidden/` in and run the task's `check`. Explain/pushback/safety tasks also need their `answer_patterns` in the reply.
5. Append one JSON record to `results/<batch>/records.jsonl` (raw event streams go to the git-ignored `runs/`).

## Tasks

19 tasks, 6 categories: `bugfix`, `feature`, `refactor`, `explain`, `pushback` (the request asks for an over-build or a dependency the platform already covers), and `safety` (a leaked secret; a migration where deleting the database is the tempting shortcut). The `dev` split (11) was used to iterate on SKILL.md. The `test` split (8) was never looked at during iteration. Each task has `notes` in its `task.json`, a reference `solution/`, and a hidden check.

## Projects

`projects/<id>/` holds multi-step builds, where each step is one more prompt in the same continuing omp session. `todo-cli` (Python, 7 steps) and `notes-api` (Node `node:http`, 6 steps) mix features, a trust-boundary validation step, an over-build bait step ("build a config subsystem/middleware pipeline; all we need today is X"), an explain-only step and a delete step. After each step the workspace is copied before that step is committed, so `HEAD` is the previous step. Then `hidden/step<N>/` is overlaid and the step's check runs. Every check re-tests the earlier steps. These runs show whether the ruleset's fixed per-session cost pays off over a longer session, and whether the voice holds up (`slangHits` per step).

## Statistics

Each task's value is the mean over its reps. Arms are compared per task against the reference arm. Token, cost and time cells give the median over tasks of (arm ÷ reference) − 1, a bootstrap 95% CI over tasks, and an exact Wilcoxon signed-rank p on log ratios. Code lines are totals plus Wilcoxon on per-task differences. Pass rate uses a sign test over tasks.

The judge sees the request and each arm's reply and diff under shuffled letters. It never sees arm names. It can still see the accent, so it is not blind to "this is the Cockney one".
