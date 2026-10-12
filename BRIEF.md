# Brief: the Cockney skill

Jeremy wants a coding-agent **skill** in the same family as **caveman** and **ponytail**. It makes Claude (or any agent: omp, Claude Code, Codex) talk like a rude, cheeky London Cockney, *and* makes its output measurably better. The accent is the costume. The output improvement is the point.

## Research first (primary sources only)
- **caveman** (e.g. JuliusBrussee/caveman and its forks): Claude speaks in terse caveman grammar to cut output tokens.
  - Learn its intensity levels.
  - Learn what it never compresses: code, commands, error text, file paths, and security or destructive-action warnings stay exact.
  - Learn how it's installed (Claude Code plugin/skill, hooks, Codex, etc.) and what benchmarks it claims.
- **ponytail** ("lazy senior dev mode", "the best code is the code never written"; e.g. mbscodes/ponytail-claude-skill, jleechanorg/claude-commands `.claude/skills/ponytail`, orobertg/claude_code_skills):
  - Learn its decision ladder: delete or reuse before you add, native/stdlib first, no speculative abstraction, smallest diff that solves the real request.
  - Learn its prime directives, and its claimed versus independently measured results. JetBrains measured it: https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/.
- Write what you find, with links, to `research/notes.md`. Separate what each skill *claims* from what was *measured*.

## Build
1. **Main skill:** `skills/cockney/SKILL.md`, in Anthropic Agent Skills format: frontmatter `name` and `description`; the description says when to trigger it. It fuses three things:
   - **Caveman-style terseness:** fewer tokens, no preamble, no recap, no hedging.
   - **Ponytail's anti-overengineering ladder:** minimal code, delete before add, native first, smallest correct diff, and challenge the request when the real fix is smaller.
   - **The Cockney voice,** delivered rude:
     - Rhyming slang where it's funny but still clear ("have a butcher's at this", "load of old pony", "you muppet", "cor blimey", "innit", "me old china", "dog's dinner", "bang to rights").
     - Rudeness aimed at the **code and the bad idea**, never at protected traits. No slurs. "Rude" means cheeky barrow-boy banter, not abuse.
2. **Hard rules** (like caveman's exceptions): code blocks, commands, diffs, file paths, identifiers, error messages and quoted output stay exact plain English. Accent goes in prose only. Security warnings, data-loss or destructive-action confirmations, and anything the user must not misread drop the bit and are said plainly.
3. **Intensity levels,** e.g. `/cockney lite` (light seasoning), default `full`, and `/cockney guvnor` (maximum slang and maximum terseness). Plus an "off" switch ("speak proper"). Persist the level across turns the way caveman does.
4. **Translate ponytail's rules into Cockney mnemonics** the model will actually follow, e.g. "Don't build a palace when a shed'll do", "Bin it before you bodge it", "Use what's in the cupboard (stdlib) before going down the shops (deps)".
5. **Install paths, tested here on this machine:**
   - omp (`~/.omp` skills; check the omp docs for the skill dir)
   - Claude Code (`~/.claude/skills/cockney/`, and/or as a plugin)
   - Codex (`AGENTS.md` snippet)
   - Write an `install.sh` that does this. Don't install into Jeremy's global configs without asking him; install into a temp HOME to test.
6. **Measure it properly.** Jeremy, mid-build: "Don't worry about keeping it small and cheap. Make it GOOD." So build a real eval harness (`eval/`), not a toy:
   - A meaningful, varied task suite: bug fixes, features, refactors, explain-this-code, and "should push back / overbuild trap" tasks. Each task needs an automated pass check (tests).
   - Run baseline vs caveman vs ponytail vs each cockney level, with enough repeats per cell for the numbers to mean something.
   - Record output tokens, lines of code, task pass rate, time and cost. Add a blinded judge comparison of the prose quality and clarity of the answers.
   - Iterate on SKILL.md from what the evals show until cockney is clearly at least as good as baseline on pass rate, and better on tokens and code size.
   - Use Jeremy's Anthropic subscription models via `omp` (opus, sonnet, haiku) and his `openai-codex` login, as many runs as quality needs. **Never OpenRouter.**
   - Report honest numbers in the README, including where it doesn't help, the way JetBrains did for ponytail.
7. **README:** what it is, examples (before/after), install, levels, the measured results, and the safety exceptions. Keep it funny but short.

## Constraints
- Work only in `~/Dev/cockney-claude`. git is initialised; commit as you go. **Don't push or publish anywhere** without asking Jeremy.
- Don't modify `~/Dev/friday-personal` or other projects.
- Ask Jeremy (he's watching this pane) only for real decisions: the skill's name if `cockney` clashes, or whether to publish.
- When done, give a short summary: files, how to install, measured results, open questions.
