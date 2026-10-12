<p align="center">
  <img src="assets/logo.png" width="260" alt="Cockney: a cheeky East End geezer in a flat cap, giving it the thumbs up">
</p>

<h1 align="center">Cockney</h1>

<p align="center"><em>'Ave a butcher's at your code, guv. Less of it, fewer words, same tests passin'.</em></p>

A coding-agent skill in the family of [caveman](https://github.com/JuliusBrussee/caveman) and [ponytail](https://github.com/DietrichGebert/ponytail). Your agent talks like a cheeky East End barrow boy and writes the smallest change that does the job. The accent is the costume; the smaller diff is the point. Works with omp, Claude Code, Codex and anything that reads `AGENTS.md`.

## Before / after

Same request ("add the left-pad package from npm to zero-pad invoice numbers"), same model (Opus 5.5), real eval runs:

| | baseline | `cockney` (full) |
|---|---|---|
| reply | 210 words, three bolded sections, offers to add the package anyway | 147 words |
| code lines added | 9 | 5 |
| output tokens | 2,268 | 1,504 |
| tests | pass | pass |

> Invoice numbers now come out as `INV-00000042`, but I didn't add the `left-pad` package. That one's deprecated on npm, and `String.prototype.padStart` already does the same job, so there's no new dependency. If you still want the package, give us a dicky bird. [...] Ain't 'ad a butcher's at anyfink outside this repo, like stored PDFs or email templates, that might expect the unpadded `INV-42` format.

`/cockney guvnor`, same task:

> Oi guv, I never added `left-pad`. Node's had `String.prototype.padStart` built in for donkey's years, an' `left-pad` is that same one-liner as a dependency. This project's got no dependencies at all, so draggin' one in for this would be a load of old pony, innit.

## What it does

The rules, Cockney-fied so the model remembers them (full text: [`skills/cockney/SKILL.md`](skills/cockney/SKILL.md)):

1. **Do we need it?** Skip what nobody asked for; say so in one line.
2. **Check the shed.** Reuse what the codebase already has.
3. **Cupboard before the shops.** Stdlib or platform before any new dependency.
4. **A shed, not a palace.** No wrapper, base class, registry, config or "for later".

Plus: **bin it before you bodge it** (deleting beats adding), **fix the leak, not the puddle** (root cause, once, in shared code), **finish the job** (update what you broke, run the tests), **don't torch the gaff** (never delete a database or anyone's work to clear an error). Replies lead with cause, change and check, end with what wasn't checked, and skip the preamble and the recap.

## Levels

| say | you get |
|---|---|
| `/cockney lite` | plain English with a Cockney word or two; builds what you asked, names the smaller option |
| `/cockney` or `/cockney full` | proper Cockney every sentence, rhyming slang, a jab at the code (default) |
| `/cockney guvnor` | over the top: dropped h's, glottal stops, rhyming slang everywhere, pushes back on the bits you don't need |
| `speak proper`, `stop cockney`, `normal mode`, `/cockney off` | off |

Only a message that *is* the command switches the level, so "is this normal mode?" mid-task does nothing. The level sticks for the session (omp: in the extension; Claude Code: per-session state file in `~/.config/cockney/sessions/`). Default level: `COCKNEY_DEFAULT_MODE=lite|full|guvnor|off`.

## Speaks proper when it counts

The bit drops, and plain full sentences take over, for: security problems (a leaked key gets "rotate it"), anything destructive or irreversible (what gets lost is said before it happens), steps you must follow in order, a confused user, and questions it asks you. Code, diffs, commands, paths, identifiers, error text, quoted output and everything written to disk (code, comments, commits, docs) stay exact plain English at every level. Cheek goes at the code, never at who you are: no slurs, no identity-based rhyming slang (so no berk, ginger, septic, sweaty or bubble), no swearing at you. The blinded judge flagged 0 of 912 cockney replies (and 0 of 2,128 overall) as disrespectful.

## Install

```bash
./install.sh                    # every agent it finds on this machine
./install.sh --omp --claude     # or pick: --omp --claude --claude-plugin --codex --agents-md FILE
./install.sh --uninstall        # same flags, reversed
HOME=$(mktemp -d) ./install.sh  # dry run into a throwaway home
```

| host | what goes where | tested here |
|---|---|---|
| omp | `~/.omp/agent/skills/cockney/` + an extension in `~/.omp/agent/extensions/cockney/` that appends the ruleset to every turn and adds `/cockney` | live: injection, level switch, off |
| Claude Code (settings) | `~/.claude/skills/cockney/` + `SessionStart`/`UserPromptSubmit` hooks merged into `~/.claude/settings.json` | live via `--settings` |
| Claude Code (plugin) | `claude plugin marketplace add <this repo>` then `claude plugin install cockney@cockney` | live via `--plugin-dir`, incl. switch persisting across `--resume` |
| Codex | `~/.codex/skills/cockney/` + a marked always-on block in `~/.codex/AGENTS.md` | files only: the Codex CLI's login was broken on this box, so no live turn |
| any `AGENTS.md` agent | `--agents-md path/to/AGENTS.md` writes the same marked block | files only |

Why hooks and not just a skill: JetBrains found ponytail's `SKILL.md` [self-activated 0 times in 10 sessions](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) when installed on its own. The hooks inject the ruleset whether the model reaches for it or not. Needs `node` ≥ 22.18 (the hooks are TypeScript run directly); without it they skip quietly.

## Does it work?

Measured, not vibed. Full method in [`eval/README.md`](eval/README.md), raw records in `eval/results/`, research behind the design in [`research/notes.md`](research/notes.md).

**Setup.** 19 tasks with hidden automated checks (bug fixes, features, refactors, explain-only, pushback/over-build bait, safety), each run headless in omp with the arm's ruleset appended to the system prompt, on four models through Jeremy's Anthropic and OpenAI Codex logins. Seven arms: `baseline`, `concise` (the line `Answer concisely.`), `caveman`, `ponytail`, and the three cockney levels. 2,128 single-task runs, plus 154 multi-step project builds (6–7 prompts each in one session), plus a blinded Opus judge over every single-task reply. Medians are per task, with exact Wilcoxon tests over tasks.

### Single tasks, `cockney` (full) vs baseline

| model (reps) | pass rate | output tokens | code lines added | cost | judge, 1–10 |
|---|---|---|---|---|---|
| Claude Sonnet 5.5 (5) | 88.4% → 93.7% | −6.8% (p=0.10) | **−44%** (p=0.003) | **+21.7%** (p=0.003) | 7.77 → 7.18 (p<0.001) |
| Claude Opus 5.5 (3) | 100% → 100% | **−23.3%** (p<0.001) | **−36%** (p<0.001) | −2.3% (p=0.49) | 7.81 → 6.95 (p<0.001) |
| Claude Haiku 4.5 (4) | 69.7% → 73.7% | −6.3% (p=0.03) | **−36%** (p=0.02) | +8.4% (p=0.42) | 5.99 → 5.58 (p=0.06) |
| GPT-5.6 Terra (4) | 81.6% → 86.8% | **−15.4%** (p=0.01) | **−28%** (p=0.02) | +1.7% (p=0.37) | 7.21 → 6.93 (p=0.16) |

Pass rate never dropped at `full` (no pass-rate change is statistically significant). `guvnor` hit 100% on Sonnet and 82.9% on Haiku; `lite` scored closest to baseline with the judge. Held-out tasks (never used while tuning SKILL.md) tell the same story: [`eval/results/FINAL-test-split.md`](eval/results/FINAL-test-split.md).

### Multi-step builds, `cockney` (full) vs baseline

| model | project | steps passed | output tokens | cost | final code size |
|---|---|---|---|---|---|
| Sonnet 5.5 | notes-api (6 steps) | 6/6 → 6/6 | −14.0% | −10.3% | −26.4% |
| Sonnet 5.5 | todo-cli (7 steps) | 7/7 → 7/7 | −32.6% | −29.5% | −43.1% |
| Opus 5.5 | notes-api | 6/6 → 6/6 | −38.9% | −31.4% | −49.5% |
| Opus 5.5 | todo-cli | 7/7 → 7/7 | −30.2% | −25.1% | −47.3% |
| Haiku 4.5 | notes-api | 4.5/6 → 4.5/6 | +14.0% | +17.9% | +4.5% |
| Haiku 4.5 | todo-cli | 6/7 → 6/7 | −27.4% | −39.6% | −31.3% |
| GPT-5.6 Terra | notes-api | 6/6 → 6/6 | +5.8% | +1.0% | +23.4% |
| GPT-5.6 Terra | todo-cli | 7/7 → 6.67/7 | −24.7% | −21.3% | −2.5% |

Project runs are 2–4 per arm, so read these as direction, not decimals. All seven arms per model: [`eval/results/PROJECTS.md`](eval/results/PROJECTS.md).

On Sonnet and Opus the fixed cost of carrying the ruleset gets paid back over a longer session: Sonnet's +22% on single tasks turns into a 10–30% saving. Haiku and GPT-5.6 are mixed.

### Where it doesn't help (read this bit)

- **It costs more on small jobs.** The ruleset is about 1,600 tokens and gets cache-written every fresh session. On a 4-turn, three-cent Sonnet task that outweighs the output it saves: +21.7% at the median. `Answer concisely.` (7 tokens) is the cheapest arm on short tasks for every model.
- **The judge likes the accent less.** Replies are scored a bit lower on clarity (Sonnet full 4.17 vs 4.59 out of 5) with accuracy unchanged (4.60 vs 4.69). `guvnor` loses most (Sonnet 6.47 vs 7.77 overall). The judge never sees arm names but can hear the accent, so this is a judgement on the voice as much as the content. If you care most about how the reply reads, use `lite`.
- **Ponytail gets most of the code-size win on its own**, with a smaller ruleset (924 tokens), so it's cheaper: Sonnet code −55%, Opus −45%. Cockney is roughly ponytail's discipline plus a voice tax and a few extra rules. Ponytail on GPT-5.6 made replies 37% longer; cockney made them 18–26% shorter.
- **A thicker accent costs money.** An earlier, lighter version (SKILL v5, slang only at the edges, ~920 tokens) measured Sonnet cost +11.6% vs the current +21.7%, with similar pass rate and judge scores. Jeremy chose the proper accent; the bill is above.
- **The accent fades in long sessions.** In the multi-step builds, slang per reply drops from about 2 in the first step to 0–1 by the last. (The counter only sees listed slang words, not spellings like "nuffin'", so it undercounts.)
- **Haiku and GPT are noisy on the builds.** Haiku's notes-api build cost 18% more with cockney, GPT-5.6's left 23% more code and dropped one todo-cli step, and Haiku's safety-secret task failed in every arm (it refuses the key but doesn't fix the code).
- **One harness.** Everything ran in omp. Claude Code and Codex CLI wrap their own system prompts; numbers there will differ.

## Credits

Built on the ideas, and measured against the vendored rulesets, of [caveman](https://github.com/JuliusBrussee/caveman) (Apache-2.0) and [ponytail](https://github.com/DietrichGebert/ponytail) (MIT). Method borrowed shamelessly from JetBrains' [caveman](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) and [ponytail](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) write-ups. MIT licence. Now leg it, bruv.
