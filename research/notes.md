# Research notes: caveman + ponytail → cockney skill

Primary sources only. Everything here was fetched on 2026-10-11. Short links used below:
- **CV** = `https://github.com/JuliusBrussee/caveman` (main branch; plugin v3.2.0 per [plugin.json](https://github.com/JuliusBrussee/caveman/blob/main/.claude-plugin/plugin.json))
- **PT** = `https://github.com/DietrichGebert/ponytail` (main branch; latest tag v5.1.0 per [tags API](https://api.github.com/repos/DietrichGebert/ponytail/tags))

---

## 1. caveman

### What it is
- An output-style skill: "Respond terse like smart caveman. All technical substance stay. Only fluff die." ([skills/caveman/SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
- "Caveman is a voice, not broken grammar. Reader pays per token and reads in a terminal." ([SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
- It is explicitly output-only: "Skill itself does not compress input, context, files, or model thinking tokens." A separate proxy/engine targets input. ([docs/HONEST-NUMBERS.md](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md))
- The repo has grown into a product suite (proxy, `caveman learn`, `caveman browse`, `/caveman-compress`, cavecrew agents). The README calls the proxy "the big rock" and the skill "the small rock". ([README.md](https://github.com/JuliusBrussee/caveman/blob/main/README.md))

### Intensity levels: now (v3.1.0+)
There are three separate skills, not one skill with a level table:

| Skill | Invocation | Gist | Source |
|---|---|---|---|
| `caveman` | `/caveman`, or auto-triggers on "caveman mode", "be brief", "less tokens" | terse voice, articles optional | [skills/caveman/SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md) |
| `ultracave` | `/ultracave` or `/caveman ultra` only (`disable-model-invocation: true`) | "caveman with the grammar stripped. Payload only." Fragments; one word when one is enough; each fact once | [skills/ultracave/SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/ultracave/SKILL.md) |
| `megacave` | `/megacave` or `/caveman wenyan` only (`disable-model-invocation: true`) | Classical Chinese (文言文) register. "Token savings are small and noisy; never claim them." | [skills/megacave/SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/megacave/SKILL.md) |

- `/caveman status` reports the mode and changes nothing. ([SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
- Hook mode enum: `off, caveman, ultracave, megacave, commit, review, compress`. Legacy names map as `lite/full→caveman`, `ultra→ultracave`, `wenyan*→megacave`. ([.codex/codex-sessionstart.js](https://github.com/JuliusBrussee/caveman/blob/main/.codex/codex-sessionstart.js))

### Intensity levels: history
- **v1.x–v3.0.0**: there was a single skill with a level table. v1.5.0 lists `lite | full (default) | ultra | wenyan-lite | wenyan-full | wenyan-ultra`. ([v1.5.0 SKILL.md](https://github.com/JuliusBrussee/caveman/blob/v1.5.0/skills/caveman/SKILL.md))
  - lite: "No filler/hedging. Keep articles + full sentences. Professional but tight."
  - full: "Drop articles, fragments OK, short synonyms. Classic caveman."
  - ultra: "Abbreviate (DB/auth/config/req/res/fn/impl), strip conjunctions, arrows for causality (X → Y)". The current rules ban both invented abbreviations and arrows ([current Rule 3](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md)).
  - wenyan-full: "80-90% character reduction". ([v1.5.0](https://github.com/JuliusBrussee/caveman/blob/v1.5.0/skills/caveman/SKILL.md))
- v1.0.0 description: "Slash token usage ~75% by speaking like caveman". ([v1.0.0 SKILL.md](https://github.com/JuliusBrussee/caveman/blob/v1.0.0/skills/caveman/SKILL.md))
- v2.7.0 and v3.0.0 still read "Levels: lite, full, ultra and the wenyan variants … Switch: `/caveman lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra|off`". ([v2.7.0](https://github.com/JuliusBrussee/caveman/blob/v2.7.0/skills/caveman/SKILL.md), [v3.0.0](https://github.com/JuliusBrussee/caveman/blob/v3.0.0/skills/caveman/SKILL.md))
- **v3.1.0** made the split into `caveman` / `ultracave` / `megacave` skills (commit `8af1f1b9b1`). ([v3.1.0 SKILL.md](https://github.com/JuliusBrussee/caveman/blob/v3.1.0/skills/caveman/SKILL.md), [v3.1.0 ultracave](https://github.com/JuliusBrussee/caveman/blob/v3.1.0/skills/ultracave/SKILL.md), [tags API](https://api.github.com/repos/JuliusBrussee/caveman/tags))

### Rules (current caveman SKILL.md; [source](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
1. **Answer first.** "Answer, then reason, then next step. Pattern: `[thing] [action] [reason]. [next step].`"
2. **Kill ceremony.** "No greeting, hedging, pleasantries, recap, or closer. No 'Sure!', 'Let me', 'I'll now', 'Hope this helps'. No just/really/basically/actually/simply."
3. **Short word.** "Standard acronyms fine (DB, API, HTTP). Invented abbreviations not (cfg, impl, fn): same tokens, harder read. No arrows."
4. **Articles optional, meaning never.** "Never drop not/never/no/only/except. Numbers and units exact."
5. **One idea per sentence.** "ASD-STE100 is the floor: 20 words max, active voice … Compression and clarity conflict? Clarity wins."
6. **Payload verbatim.** "Code blocks unchanged. Commands, paths, API names exact. Errors quoted exact … Existing comments in files you edit are payload too."
7. **Tool runs: bounded status.** "No text between routine calls. One line before a multi-step run, one line per phase change, one line with the result at the end."
8. **User's language.** "Compress the style, not the language."
9. **Never perform caveman.** "No 'caveman mode on', no 'me think', no 'Caveman:' prefix … Never add a word to sound caveman. Caveman phrasing not shorter than plain? Use plain."
- The "Why" section also says: "A dropped negation costs more than every token saved. Clarity beats compression."
- Pre-send check: delete an opening announcement and a closing recap or offer; confirm negations and payload are verbatim; rewrite any sentence with two readings as a full sentence.

### Never compressed (the floor)
- Code, commands, paths, API names, error strings, not/never/no/only/except, numbers and units, the user's language, one term per thing, and existing comments in files you edit. ([ultracave "Floor"](https://github.com/JuliusBrussee/caveman/blob/main/skills/ultracave/SKILL.md); same items appear in caveman Rules 4, 6 and 8: [caveman](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))

### When to break the rules (verbatim list; [source](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
"Plain prose, then resume:"
1. Security warning.
2. Irreversible action. Confirm in full sentences first.
3. Step order a fragment could scramble.
4. User confused or repeats the question.
5. Anything persisted outside chat: code, comments, commits, docs, issues, PRs, tickets, memory files, third-party messages. `/caveman-compress` exempt.
6. Harness asks for a status line or confirmation. "Harness decides *when* you speak, caveman decides *how*."
7. You ask the user a question or offer options. Full sentences.
- The v1.5.0 precursor was called "Auto-Clarity". Its destructive-op example is a full-sentence warning followed by "Caveman resume. Verify backup exist first." ([v1.5.0](https://github.com/JuliusBrussee/caveman/blob/v1.5.0/skills/caveman/SKILL.md))

### Persistence across turns
- Skill text: "Every response, whole session, until user says 'stop caveman' or 'normal mode'. Unsure if still on? It is." ([SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md))
- Claude Code plugin hooks ([.claude-plugin/plugin.json](https://github.com/JuliusBrussee/caveman/blob/main/.claude-plugin/plugin.json)):
  - `SessionStart` → `src/hooks/caveman-activate.js` (injects the ruleset)
  - `SubagentStart` → `caveman-activate.js --subagent`
  - `UserPromptSubmit` → `src/hooks/caveman-mode-tracker.js`
  - `SessionEnd` → `caveman-stats.js --record`
  - Every hook command starts with `command -v node … || exit 0`, so it fails open when node is missing.
- The tracker "Inspects user input for /caveman commands and writes mode to flag file". The flag file is `~/.claude/.caveman-active`, with `.caveman-active.prev`. It also keeps per-session state keyed by `session_id`, and it skips scheduled-task prompts. ([caveman-mode-tracker.js](https://github.com/JuliusBrussee/caveman/blob/main/src/hooks/caveman-mode-tracker.js))
- Default-mode resolution order: `CAVEMAN_DEFAULT_MODE` env → repo `.caveman/config.json` or `.caveman.json` (walking up) → `$XDG_CONFIG_HOME/caveman/config.json` or `~/.config/caveman/config.json` → `'caveman'`. ([.codex/codex-sessionstart.js](https://github.com/JuliusBrussee/caveman/blob/main/.codex/codex-sessionstart.js))
- Codex: the repo-local [.codex/hooks.json](https://github.com/JuliusBrussee/caveman/blob/main/.codex/hooks.json) has a `SessionStart` hook (matcher `startup|resume`) that runs `codex-sessionstart.js`. The script says Codex has "no tracker hook wired", so a mode switched mid-session is not resumed. It deliberately "never call[s] process.exit() after the ruleset write" because doing so can drop stdout. ([codex-sessionstart.js](https://github.com/JuliusBrussee/caveman/blob/main/.codex/codex-sessionstart.js))
- opencode subagents get the rules from `AGENTS.md` as fixed text, "so 'stop caveman' does not switch them off for subagents". ([INSTALL.md](https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md))

### Install paths ([INSTALL.md](https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md))
- One-liner pinned to a tag: `curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/v3.2.0/install.sh | bash`. It supports `--dry-run`. Hook files are checked against a SHA-256 list.
- Claude Code: `claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman`, or in-app `/plugin marketplace add …` then `/plugin install caveman@caveman`. The marketplace is [.claude-plugin/marketplace.json](https://github.com/JuliusBrussee/caveman/blob/main/.claude-plugin/marketplace.json).
- Gemini CLI: `gemini extensions install https://github.com/JuliusBrussee/caveman` (always-on).
- Codex: `npx -y github:JuliusBrussee/caveman -- --only codex` installs the SessionStart hook, which you trust once via `/hooks`. Skills only: `npx skills add JuliusBrussee/caveman -a codex -g`, invoked as `$caveman`.
- About 25 other agents use `npx skills add JuliusBrussee/caveman -a <agent> -g`. Most of them are "No" for always-on. Windsurf and Cline need `--with-init` to write an always-on rule file.
- npm ≥12 needs `--allow-git=root` for `npx github:` installs.
- Root [AGENTS.md](https://github.com/JuliusBrussee/caveman/blob/main/AGENTS.md), [CLAUDE.md](https://github.com/JuliusBrussee/caveman/blob/main/CLAUDE.md) and [GEMINI.md](https://github.com/JuliusBrussee/caveman/blob/main/GEMINI.md) ship in the repo.

### Token cost of its rules
- README: "The `/caveman` rules are about 1,160 tokens of text (tiktoken count). What that adds to your bill depends on caching; not measured yet." ([README.md](https://github.com/JuliusBrussee/caveman/blob/main/README.md))
- HONEST-NUMBERS lists "Input cost the skill *adds*" as "Not measured yet". `evals/measure.py` now reports the median input tokens added, but the committed snapshot predates usage capture. ([HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md))
- In [#145](https://github.com/JuliusBrussee/caveman/issues/145) a user's agent estimated "~1-1.5k tokens input overhead per turn" and said "Short Q&A = loss". That figure is the model's own guess, not a measurement.
- The current caveman SKILL.md is 744 words / 4,678 bytes (`wc` on the [raw file](https://raw.githubusercontent.com/JuliusBrussee/caveman/main/skills/caveman/SKILL.md)).

---

## 2. ponytail

### What it is
- "You are a lazy senior developer. The best code is the code never written. You solve the whole problem with the least new code. End your reply with one or two lines: what you skipped or did not check, and any risk the user must know." ([skills/ponytail/SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))
- "Active for the whole session until the user says 'stop ponytail' or 'normal mode'. Switch level: `/ponytail lite|full|ultra`." (same file)
- Companion skills: `ponytail-review`, `-audit`, `-debt`, `-gain`, `-help`. ([tree](https://github.com/DietrichGebert/ponytail/tree/main/skills), [README](https://github.com/DietrichGebert/ponytail/blob/main/README.md))

### Decision ladder: current main (verbatim; [SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))
> Take the first option that fully works:
> 1. Does it need to exist? Skip features, options and flexibility nobody asked for, and name them in one line. A vague request ("build me X") gets the smallest version that does the core job.
> 2. Already in this codebase (a helper, component, service, pattern)? Use it the way the surrounding code does.
> 3. Standard library or a platform feature? Use it, unless the project has its own. A house component beats a native widget.
> 4. An installed dependency? Use it. Never add a dependency for a few lines.
> 5. Can it be one line a reader gets at a glance? One line.
> 6. Otherwise: the minimum code that works.

Before the ladder there is a "Before you write" step: "Read the task and the code it touches. List every place your change must reach: callers, tests, fixtures, config, exports … That is scope. Extra features are not." ([SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))

### Ladder history
- **v1.0.0** has 6 rungs and no "already in codebase" rung: "Stop at the first rung that holds: 1. **Does this need to exist at all?** … (YAGNI) 2. **Stdlib does it?** 3. **Native platform feature covers it?** `<input type="date">` over a picker lib, CSS over JS, DB constraint over app code. 4. **Already-installed dependency solves it?** … 5. **Can it be one line?** 6. **Only then:** the minimum code that works." It adds: "The ladder is a reflex, not a research project." ([v1.0.0](https://github.com/DietrichGebert/ponytail/blob/v1.0.0/skills/ponytail/SKILL.md))
- **v4.x** has 7 rungs. It inserts "2. **Already in this codebase?** … re-implementing what's a few files over is the most common slop" and keeps stdlib and native platform as separate rungs. It adds that the ladder "runs *after* you understand the problem" and "**Bug fix = root cause, not symptom.** … grep every caller". ([v4.13.0](https://github.com/DietrichGebert/ponytail/blob/v4.13.0/skills/ponytail/SKILL.md))
- The README image alt-text still describes 7 rungs: "1 does this need to exist, 2 already in this codebase, 3 does the standard library do it, 4 a native platform feature, 5 an installed dependency, 6 can it be one line, 7 only then the minimum that works, plus one small test if it has logic." ([README](https://github.com/DietrichGebert/ponytail/blob/main/README.md))

### Key rules (current; [SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))
- "Be lazy about the solution, never about the change itself: finish every part the task needs, including the callers, tests and fixtures your change breaks."
- "No abstraction, wrapper, type conversion, option, config, boilerplate or 'for later' code nobody asked for … Deletion beats addition. Keep the structure the codebase already has."
- "The shortest working diff wins, once you know everything it must touch. A one-liner that needs decoding is not short."
- "Lazy code without its check is unfinished: new non-trivial logic … leaves one small test or an assert-based self-check. Trivial changes need none."
- "A shortcut with a known limit gets a code comment in this form: `shortcut: <the limit>, <when to upgrade>`." Older versions used "`ponytail:` comment" for this ([v1.0.0](https://github.com/DietrichGebert/ponytail/blob/v1.0.0/skills/ponytail/SKILL.md)).
- The old output rule (v1.0.0) was "Code first. Then at most three short lines … Pattern: `[code] → skipped: [X] — add when [Y].` … every paragraph defending a simplification is complexity smuggled back in as prose." ([v1.0.0](https://github.com/DietrichGebert/ponytail/blob/v1.0.0/skills/ponytail/SKILL.md))

### Never cut (verbatim)
> Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for.
([SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))

### Levels
| Level | Behavior (verbatim) | Source |
|---|---|---|
| lite | "Build what was asked. Name the smaller option in one line and let the user pick." | [SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) |
| full | "The rules above. Default." | same |
| ultra | "Also question the request: before building, push back on any part the need does not justify." | same |
| off | Runtime mode; `VALID_MODES = ['off','lite','full','ultra','review']`, `RUNTIME_MODES = ['off','lite','full','ultra']` | [hooks/ponytail-config.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-config.js) |

### "Prime directives": where they come from
- The canonical repo has no "prime directive(s)" text. I grepped `skills/ponytail/SKILL.md` at [v1.0.0](https://github.com/DietrichGebert/ponytail/blob/v1.0.0/skills/ponytail/SKILL.md), [v4.0.0](https://github.com/DietrichGebert/ponytail/blob/v4.0.0/skills/ponytail/SKILL.md), [v4.8.0](https://github.com/DietrichGebert/ponytail/blob/v4.8.0/skills/ponytail/SKILL.md), [v4.13.0](https://github.com/DietrichGebert/ponytail/blob/v4.13.0/skills/ponytail/SKILL.md) and main, plus [AGENTS.md](https://github.com/DietrichGebert/ponytail/blob/main/AGENTS.md): no matches.
- The phrase is in the **orobertg** fork: "Ponytail has one prime directive: **the literal request is not the whole request.** When Robert asks for a quick fix, he is asking for the problem to go away — he is not asking to override the architecture he already built." Its epigraph is "The best code is the code that was never written. The second best is the code that already exists and just needed to be called, not copied." ([orobertg/claude_code_skills ponytail/SKILL.md](https://github.com/orobertg/claude_code_skills/blob/HEAD/ponytail/SKILL.md))
- The closest canonical equivalents are the opening line plus "Be lazy about the solution, never about the change itself" and the never-cut list. ([SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md))

### Persistence
- Claude/Codex hooks ([hooks/claude-codex-hooks.json](https://github.com/DietrichGebert/ponytail/blob/main/hooks/claude-codex-hooks.json)):
  - `SessionStart` (matcher `startup|resume|clear|compact`) → `ponytail-activate.js`. Matching `clear` and `compact` re-injects the rules after those events.
  - `SubagentStart` → `ponytail-subagent.js`
  - `UserPromptSubmit` → `ponytail-mode-tracker.js`
- The tracker "Inspects user input for /ponytail commands and writes mode to flag file". Bare `/ponytail` turns ponytail on at the default level (`full` if the default is `off`). The tracker emits "PONYTAIL MODE OFF" on off. ([ponytail-mode-tracker.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-mode-tracker.js))
- "stop ponytail" / "normal mode" turn it off "only as a standalone command. Matching the phrase anywhere in the message turned it off mid-task". ([ponytail-config.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-config.js))
- The flag file is `.ponytail-active` in `~/.claude` (or `~/.cursor`, `~/.qoder`, `~/.codebuddy`), plus per-session `ponytail-modes/`. ([ponytail-runtime.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-runtime.js), [INSTALL.md](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md))
- Injected text comes from `ponytail-instructions.js`. It reads `skills/ponytail/SKILL.md`, strips the frontmatter, and filters the level-table rows and examples to the active mode. One source feeds both the skill and the hook. ([hooks/ponytail-instructions.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-instructions.js))
- Default mode: `PONYTAIL_DEFAULT_MODE` env (`lite/full/ultra/off`) → `defaultMode` in `$XDG_CONFIG_HOME/ponytail/config.json` / `~/.config/ponytail/config.json` / `%APPDATA%\ponytail\config.json` → `full`. Other options are `PONYTAIL_QUIET_STARTUP`, `PONYTAIL_HIDE_STATUS` and `PONYTAIL_SUBAGENT_MATCHER` (a regex on `agent_type`). ([ponytail-config.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-config.js), [INSTALL.md](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md))

### Install paths
- Claude Code: `/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail`. ([README](https://github.com/DietrichGebert/ponytail/blob/main/README.md))
- Codex: `codex plugin marketplace add DietrichGebert/ponytail` and `codex plugin add ponytail@ponytail`, then trust the two hooks in `/hooks`. (same)
- Gemini: `gemini extensions install https://github.com/DietrichGebert/ponytail`. Skills CLI: `npx skills add DietrichGebert/ponytail`. ([INSTALL.md](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md))
- Any other agent: copy [AGENTS.md](https://github.com/DietrichGebert/ponytail/blob/main/AGENTS.md). The repo also ships rule files for Cursor (`.cursor/rules/ponytail.mdc`), Windsurf, Cline, Kiro, Qoder, Copilot (`.github/copilot-instructions.md`) and others. ([tree](https://api.github.com/repos/DietrichGebert/ponytail/git/trees/HEAD?recursive=1))
- Supply-chain note: "Only install ponytail from `DietrichGebert/ponytail` on GitHub or `@dietrichgebert/ponytail` on npm. It never ships `.exe` or `.dll` files". ([README](https://github.com/DietrichGebert/ponytail/blob/main/README.md))
- Token cost: neither the README nor HONEST-style docs state one. The current SKILL.md is 592 words / 3,492 bytes (`wc` on the [raw file](https://raw.githubusercontent.com/DietrichGebert/ponytail/main/skills/ponytail/SKILL.md)).

### Forks / copies named in the brief
| Repo | Status | How it differs | Source |
|---|---|---|---|
| mbscodes/ponytail-claude-skill | A GitHub fork of DietrichGebert/ponytail, last pushed 2026-07-15. The compare API shows it **0 ahead, 113 behind** upstream. | Its `skills/ponytail/SKILL.md` has no diff against upstream **v4.13.0**. It is a stale snapshot (7-rung ladder, `ponytail:` comments) with no changes of its own. | [repo API](https://api.github.com/repos/mbscodes/ponytail-claude-skill), [compare](https://api.github.com/repos/mbscodes/ponytail-claude-skill/compare/DietrichGebert:ponytail:main...mbscodes:ponytail-claude-skill:main), [SKILL.md](https://github.com/mbscodes/ponytail-claude-skill/blob/HEAD/skills/ponytail/SKILL.md) |
| jleechanorg/claude-commands `.claude/skills/ponytail` | `jleechanorg/claude-commands` returns **301 Moved Permanently**. It now resolves to `jleechanorg/jleechan-skills`, and the path exists there (1,618 bytes). | It is a ~15-line neutral-voice condensation adapted from upstream `.github/copilot-instructions.md`. It has a 7-step ladder ("Avoid building … Reuse … standard-library … native platform … dependency already installed … simple expression … remaining necessary code"), no levels, no hooks and no persona. It also says: "Verify nontrivial behavior with the smallest runnable check". | [API redirect](https://api.github.com/repos/jleechanorg/claude-commands), [SKILL.md](https://github.com/jleechanorg/jleechan-skills/blob/main/.claude/skills/ponytail/SKILL.md) |
| orobertg/claude_code_skills `ponytail/` | Exists. | It is a rewrite, not a fork. It is aimed at **scope/architecture fidelity** and is the companion to a "precision-review" style skill. It has the "one prime directive" (literal request ≠ whole request) and "Four Failure Modes" (over-engineering, dead code, non-consolidation, …). It is personalised to one user ("Robert"), auto-triggers on any code change, and has no levels or hooks. | [SKILL.md](https://github.com/orobertg/claude_code_skills/blob/HEAD/ponytail/SKILL.md) |

---

## 3. Claims vs measured

### caveman
| Claim | Source | Independent / later measurement | Source |
|---|---|---|---|
| "Cuts token usage ~75%" (v1.x description) | [v1.0.0](https://github.com/JuliusBrussee/caveman/blob/v1.0.0/skills/caveman/SKILL.md), [v1.5.0](https://github.com/JuliusBrussee/caveman/blob/v1.5.0/skills/caveman/SKILL.md) | The repo's own figure vs `Answer concisely.` control: **caveman 3%, ultracave 35%, megacave 9%** median output reduction (n=10, single run, opus-5-5, measured on the 3.1.0 text) | [HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md) |
| "65% output token saved. Every reply." (README pitch quoted by JetBrains) | [JetBrains caveman post](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) | **JetBrains**: SkillsBench 86/87 tasks, Claude Code 2.1.200, `claude-sonnet-5` effort low, skill **forced on**, 3 runs, ~240 trials, ~USD 106. **−8.5% output tokens** (592k→542k over 82 paired tasks), which they call the ceiling. Quality: 8 better / 10 worse / 64 tied, sign test p=0.82, mean score 0.326 vs 0.311. | [JetBrains caveman post](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) |
| Cheaper because output is shorter | (implied by pitch) | **JetBrains**: expected ~−10% cost, but raw totals had the skill arm **+11.6%** (USD 40.60 vs 36.39). One task crossed the 200k long-context tier and billed USD 8.29 vs 0.33. "Routinely erased by single-trial variance." | [JetBrains caveman post](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) |
| (small-run result) | — | JetBrains' first 10-task run showed about −30% (−29.5%). It "did not replicate". "Never trust a k=1 eval." | [JetBrains caveman post](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) |
| Output shrinks ⇒ bill shrinks | — | **LemonCrow** (#727): 20 prompts × 5 reps × 3 runs, `claude-opus-4-8`. Output −41.4% to −47.7% per run (HONEST-NUMBERS: −44.1% overall). Cost −1.74%, −1.20%, +3.27% per run, **+0.06% total**. Initial cached context **+1,532 tokens/run**. | [issue #727](https://github.com/JuliusBrussee/caveman/issues/727), [HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md) |
| Big output saving | — | **edubraqd** (#733): 10 pt-BR dev questions, haiku-4-5, 20 replies/arm. A terse CLAUDE.md alone gave −34%. CLAUDE.md+caveman gave −40%, so caveman's own increment was **−8%** (median −5%, stdev 25%). Against the repo's own `Answer concisely.` control it was **+19% median**. Across 662 real sessions, output was **0.3%** of all tokens and the net bill effect was within ±0.2%. | [#733 comment](https://github.com/JuliusBrussee/caveman/issues/733#issuecomment-5657222190), [HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md) |
| Saves tokens | — | Net losses: on terse Q&A the fixed prompt overhead exceeds the saving ([#145](https://github.com/JuliusBrussee/caveman/issues/145)). On per-request billing like Copilot there is no saving ([#506](https://github.com/JuliusBrussee/caveman/issues/506)). One Cursor A/B used 4.3M tokens with caveman vs 1M without (not reproducible; [#550](https://github.com/JuliusBrussee/caveman/issues/550)). | [HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md) |
| (caveman as a control arm in ponytail's bench) | — | Caveman alone: LOC −20%, **tokens +7%, cost +3%**, time +2% vs baseline. "terse output, same deliberation, so it is not cheaper." | [ponytail 2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md) |
| Output-style compression is fine; what about compressing input? | — | **Adobe CAVEWOMAN**: 8 models × 5 datasets. Output compression cuts realized cost 1.4–2.4× on most API models. **Input compression is "a strict lose-lose"**: net cost goes *up* about 1.15× (up to 1.8×, or 2.7× under stronger compression) "because models compensate with longer responses even as accuracy collapses". | [arXiv 2606.24083](https://arxiv.org/abs/2606.24083) |

### ponytail
| Claim | Source | Independent / later measurement | Source |
|---|---|---|---|
| Original single-shot benchmark: 80–94% LOC reductions | [2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md) (restating) | **Issue #126 (ColinEberhardt)**: the baseline lacked a harness-like system prompt. Adding `Provide just one example for any given task, and no commentary or usage examples.` cut baseline LOC from **108 to 16**, vs ponytail 8.25 (Haiku). "the central claims of this project should be a bit more modest." | [issue #126](https://github.com/DietrichGebert/ponytail/issues/126) |
| v4 agentic: **−54% LOC, −22% tokens, −20% cost, −27% time** (12 feature tickets on the FastAPI+React template, Haiku 4.5, n=4, Claude Code 2.1.177; arms baseline/ponytail/caveman/yagni-oneliner) | [2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md) | Same doc, own caveats: per task the cut ranges from ~0% (backend CRUD) to −94% (date picker). On the 6 safety tasks ponytail got LOC −5%, cost −7%, 100% safe. Colin's one-liner (`Follow YAGNI principles, and prefer one-liner solutions.`) got −33% LOC, −21% cost, −30% time, but 95% safe (one `../../` slip). | [2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md) |
| (same −54/−22/−20/−27 headline) | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) quoting it | **JetBrains**: 80 paired SkillsBench tasks, Claude Code 2.1.201, `claude-sonnet-5` medium, ponytail **v4.8.4** ruleset injected byte-identical from `ponytail-instructions.js`, 251 trials, USD 246.09. Code **−15.4%** median (10,205→8,756 lines, **p=0.088**). Cost **−10.3%** (p=0.004, 46 cheaper / 34 dearer; the bootstrap CI on the median "just touches zero"). Time **−11%**. Input side not significant: cache re-read −8.4% (p=0.138), fresh −3.9% (p=0.085). | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) (fetched via [Wayback snapshot](https://web.archive.org/web/20261011160901/https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/); the live page served a bot challenge) |
| No quality loss / 100% safety | [2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md) | **JetBrains**: 65 same / 9 worse / 6 better, a null result "not powered to prove equivalence". SkillsBench verifiers do not test security, so the safety claim was untested. | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |
| Description says use on "ANY coding task" (model-invoked) | [v4.x SKILL.md](https://github.com/DietrichGebert/ponytail/blob/v4.13.0/skills/ponytail/SKILL.md) | **JetBrains**: with only SKILL.md installed it self-activated **0/10 sessions**. "Copy the SKILL.md into a skills folder and you will very likely measure nothing." | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |
| Mark shortcuts with a `ponytail:` comment | [v4.13.0 SKILL.md](https://github.com/DietrichGebert/ponytail/blob/v4.13.0/skills/ponytail/SKILL.md) | **JetBrains**: this happened **once in 80** trials. "The ladder gets followed; the paperwork does not." | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |
| (smoke run) | — | JetBrains' 10-task smoke run showed code −3%, cost **+9.6%**, and scores dropping 0.51→0.31. All of it reversed at n=80. | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |
| Where the cut lives | — | **JetBrains**: −31% on big builds, ~0 on lean tasks. The thresholds were chosen post hoc. | [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |
| Ponytail 5: **−53% code, −41% time, −26% cost, −45% tokens**; 98% of risky logic ships with a test vs 68% (39 tasks, Opus 5.5, 5 runs) | [README](https://github.com/DietrichGebert/ponytail/blob/main/README.md), [2026-10-07-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md) | No independent replication of v5 found. | — |
| Harness contamination | — | Ponytail's own team found its `SessionStart` hook firing in the baseline arm, which produced a fake ~4% gap. They fixed it with `--setting-sources project,local` plus `--plugin-dir`. JetBrains audited every trial: 100% of treatment trials had the ruleset, 0% of baseline trials did. | [2026-06-18-agentic.md](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md), [JetBrains ponytail post](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/) |

---

## 4. Lessons for our skill

- **A SKILL.md alone does nothing.** Ponytail self-activated 0/10 times as a model-invoked skill ([JetBrains ponytail](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/)). Ship always-on injection: SessionStart with `startup|resume|clear|compact` ([ponytail hooks](https://github.com/DietrichGebert/ponytail/blob/main/hooks/claude-codex-hooks.json)), SubagentStart, and a UserPromptSubmit mode tracker ([caveman plugin.json](https://github.com/JuliusBrussee/caveman/blob/main/.claude-plugin/plugin.json)).
- **Generate the injected text from SKILL.md.** Ponytail's `ponytail-instructions.js` does this so the two never drift ([source](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-instructions.js)).
- **Off switches must be standalone commands.** Matching "normal mode" anywhere in a message switched ponytail off mid-task ([ponytail-config.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-config.js)).
- **Hooks must fail open.** Caveman exits 0 when node is missing ([plugin.json](https://github.com/JuliusBrussee/caveman/blob/main/.claude-plugin/plugin.json)) and avoids `process.exit()` after writing stdout ([codex-sessionstart.js](https://github.com/JuliusBrussee/caveman/blob/main/.codex/codex-sessionstart.js)).
- **Output tokens are a small share of an agent's bill.** They were 0.3% of tokens across 662 sessions ([#733](https://github.com/JuliusBrussee/caveman/issues/733#issuecomment-5657222190)). Output −44% left cost +0.06% ([#727](https://github.com/JuliusBrussee/caveman/issues/727)), and the agentic output cut was −8.5% ([JetBrains caveman](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)). Voice alone will not save money; ponytail's measured cost win came from writing less *code* ([JetBrains ponytail](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/)). So the anti-overengineering half is the part that pays.
- **Caveman-style terseness as an arm can raise cost.** It measured tokens +7% and cost +3% in ponytail's bench ([2026-06-18](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md)), and the Cursor A/B used 4.3M vs 1M tokens ([HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md)). Terse prose without changing deliberation is not cheaper.
- **The fair baseline is a terse control, not a bare model.** Use `Answer concisely.` ([evals/README](https://github.com/JuliusBrussee/caveman/blob/main/evals/README.md)), a one-line "one example, no commentary" prompt ([#126](https://github.com/DietrichGebert/ponytail/issues/126)), and Colin's YAGNI one-liner ([2026-06-18](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-06-18-agentic.md)). Against these controls, caveman shrank to 3% ([HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md)).
- **Small samples mislead in both directions.** Caveman's −30% at 10 tasks became −8.5% ([JetBrains](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)). Ponytail's +9.6% cost at 10 tasks became −10.3% at 80 ([JetBrains](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/)). Use paired designs, medians and Wilcoxon/sign tests, and audit that the ruleset actually reached each arm.
- **Rules text is paid every turn, so keep it short and measure it.** Caveman's rules are about 1,160 tokens, with the input overhead "not measured yet" ([README](https://github.com/JuliusBrussee/caveman/blob/main/README.md)). LemonCrow measured +1,532 cached tokens per run ([#727](https://github.com/JuliusBrussee/caveman/issues/727)). Report the ruleset's input-token overhead (skill arm minus terse arm, cache included) the way `evals/measure.py` now does ([evals/README](https://github.com/JuliusBrussee/caveman/blob/main/evals/README.md)).
- **Bookkeeping rules are rarely followed.** The `ponytail:` / shortcut comment rule was followed 1 time in 80 ([JetBrains ponytail](https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/)). Drop the rule or make it one terse line. Don't spend ruleset tokens on it.
- **Keep the floors explicit and short.** From caveman: negations, numbers, code, paths and errors stay verbatim, and full prose returns for security, irreversible actions, ordered steps, confused users, persisted artifacts and questions ([caveman SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md)). From ponytail: never cut validation, data-loss handling, security, accessibility, or what the user asked for ([ponytail SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md)).
- **Persisted artifacts stay plain English.** The Cockney voice goes in chat only, never in code, comments, commits, PRs or docs. This follows caveman break-rule 5 ([SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md)).
- **Don't perform the voice.** Caveman bans flavour words that don't shorten the text ("Never add a word to sound caveman") ([SKILL.md](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md)). Cockney slang that adds tokens is cost with no benefit. Allow it only where it is no longer than the plain wording.
- **Compress our output, never the user's prompt.** Input compression raised cost and collapsed accuracy ([CAVEWOMAN](https://arxiv.org/abs/2606.24083)).
- **Don't promise per-request savings.** Per-request billing like Copilot sees no saving ([HONEST-NUMBERS](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md)). Publish an honest-numbers page from day one.
- **Model the levels on caveman's three-skill split.** Caveman moved from a 6-row level table to three skills ([v3.1.0](https://github.com/JuliusBrussee/caveman/blob/v3.1.0/skills/caveman/SKILL.md)), and the extreme modes are user-invoked only (`disable-model-invocation: true`) ([ultracave](https://github.com/JuliusBrussee/caveman/blob/main/skills/ultracave/SKILL.md)). This keeps the injected text to one level's rules. Ponytail does the same by filtering level rows at injection time ([ponytail-instructions.js](https://github.com/DietrichGebert/ponytail/blob/main/hooks/ponytail-instructions.js)).
