# Where to list cockney: research on listing venues

Checked 2026-10-11/12 (local time), against live sites, GitHub API data, raw README/CONTRIBUTING files and official docs. Research only: nothing was submitted, no accounts were made, and no other repo file was edited.

**Repo state when checked** (`gh api repos/Kadajett/cockney`): 0 stars, created 2026-10-12T06:02Z, first commit 2026-10-12T01:51:14Z, 18 commits, default branch **`master`**, `topics: []`, `homepage: null`, and **license detected as `Other` / `NOASSERTION`, not MIT** (see repo change R1).

**Comparable repos.** caveman (JuliusBrussee/caveman) has about 111k stars and ponytail (DietrichGebert/ponytail) about 161k. Where they are listed is the legitimacy signal used throughout. The "caveman / ponytail" column links their listing when one exists.

Legend: **Auto** = indexed with no action from us. **Now** = can be done today. **Later** = blocked by a star, age or maturity gate, or by a repo change.

---

## 1. Legitimate venues, sorted by reach

| # | Venue | Type | How it gets listed | Gate / requirements | Exact action for cockney | caveman / ponytail | When |
|---|---|---|---|---|---|---|---|
| 1 | **Anthropic plugin directory**: [claude.ai/directory](https://claude.ai/directory/manage), published to Claude Code as the `claude-community` marketplace ([anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community), 4.6k★, 2,284 plugins) | official plugin marketplace | Web form in the claude.ai developer portal, which reads the plugin from GitHub. PRs to the community repo are auto-closed. | Paid claude.ai plan (Pro/Max/Team/Ent). The GitHub account must have push access. `.claude-plugin/plugin.json` at the submitted folder (repo root). README ≥ 40 words. LICENSE or `license`. Kebab-case unique name. Text files ≤ 256 KiB and no non-image binaries, otherwise the version is held for a human reviewer (cockney's `eval/results/*/records.jsonl` and `eval/tasks/.../app.db` trigger this). ≤ 512 files. The security scan wants the README to disclose everything the plugin runs or writes. Human review. No `.gitattributes export-ignore`. | Do R1, R4, R5 and preferably R12 first. Run `claude plugin validate --strict .`, then claude.ai/directory/manage → Submit new → **Plugin bundle** → Repository `Kadajett/cockney`, Plugin path empty, Branch `master` → Validate → Listing details → Data handling (no personal data, no network; writes a per-session mode file locally) → Compliance (contact email, 4 acks) → keep the "GitHub push webhook" → Submit. Users then run `/plugin marketplace add anthropics/claude-plugins-community` and `/plugin install cockney@claude-community`. | both: [caveman L3101](https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json#L3101), [ponytail L23411](https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json#L23411) | Now (after R1/R4/R5) |
| 2 | **[skills.sh](https://www.skills.sh)** + Vercel `skills` CLI ([vercel-labs/skills](https://github.com/vercel-labs/skills), 33.9k★; npm `skills` ≈ 25.2M downloads/month) | CLI installer + leaderboard | **Auto** from anonymous install telemetry. A page appears once someone runs `npx skills add Kadajett/cockney` on a public repo. No form. | `skills/<name>/SKILL.md` with `name` and `description`. Extra keys are tolerated. Verified: `npx skills add Kadajett/cockney --list` finds 1 skill. | Nothing to submit. Put `npx skills add Kadajett/cockney` and the badge in the README (R4). Do not self-install repeatedly to game the ranking. | both: [caveman](https://www.skills.sh/juliusbrussee/caveman), [ponytail](https://www.skills.sh/dietrichgebert/ponytail) | Auto |
| 3 | **[hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)** (55.5k★) | awesome list | **Issue form only**, through the web UI, by a human: [recommend-resource.yml](https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml). No PRs, no `gh` CLI, no bots. | Bot-enforced: repo ≥ **14 days** since its first commit **plus** commits after day 1, **or ≥ 100★**. One recommendation at a time. Plain description, no sales pitch, no emojis. Must be Claude Code specific. | On or after **2026-10-26T01:51Z** (keep committing until then), fill in the form with the text in §3. | caveman yes (`## Skills`, first entry); ponytail no | Later (2026-10-26) |
| 4 | **[github/awesome-copilot](https://github.com/github/awesome-copilot)** (39.9k★; the built-in default marketplace in Copilot CLI) | plugin marketplace | Issue form [external-plugin.yml](https://github.com/github/awesome-copilot/issues/new?template=external-plugin.yml). Direct PRs to `plugins/external.json` are forbidden. | Public repo, immutable tag plus 40-char SHA, semver, license, author, kebab keywords. `vally lint` and a Copilot CLI install smoke test, then maintainer `/approve` and re-review every 6 months. Copilot auto-loads `hooks/hooks.json` with its own schema (R6). The policy rejects plugins that "duplicate existing model strengths without meaningful uplift", and community caveman-mode instructions already exist there. | After R6 and R13: form fields Plugin name `cockney`, repo `Kadajett/cockney`, path `/`, ref `v0.1.0`, SHA `<sha of v0.1.0>`, version `0.1.0`, license `MIT`, author `Jeremy Stover` / `https://github.com/Kadajett`, homepage repo URL. | neither | Later (R6, R13) |
| 5 | **OpenAI Plugin Directory**: [platform.openai.com/plugins](https://platform.openai.com/plugins), shared by ChatGPT and Codex | official plugin marketplace | Web upload of a ZIP, automated checks, human review, then publish. | OpenAI platform org with individual or business **verification**. `.codex-plugin/plugin.json` (or a portable root `plugin.json`) plus skills. **ZIPs with lifecycle hooks are rejected**, so this has to be a skills-only ZIP and loses the always-on hooks. | Build a ZIP of `.codex-plugin/plugin.json` (R9 without `hooks`/"Lifecycle hooks"), `skills/cockney/SKILL.md` and `assets/logo.png`. Upload → choose the verified identity → resolve findings → Submit for review → Publish. | unknown (no public search) | Later (verification, R9) |
| 6 | **[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)** (76.9k★) | awesome list | PR to README.md | No star or age rule. Alphabetical within the category, no emojis. The bot labels a PR ready only if it touches README.md alone, stays inside `## Skills`…`## Getting Started`, links an external https URL, is alphabetical, and contains **none of the words** `token`, `crypto`, `wallet` and similar. | PR "Add cockney skill" with the line in §3. | neither | Now (low odds: 0 of the last 100 closed PRs merged) |
| 7 | **[ClawHub](https://clawhub.ai)** (the OpenClaw registry; [openclaw/clawhub](https://github.com/openclaw/clawhub) 9.5k★, openclaw 392k★) | registry (CLI publish) | `clawhub login` (GitHub device flow), then `clawhub skill publish`. | Skill folder with SKILL.md and a kebab name. **Everything is relicensed MIT-0**, and the docs say not to put conflicting license text in SKILL.md. Every release is scanned (ClawScan, VirusTotal and others). ≤ 3 categories and ≤ 5 topics. Only the skill folder ships, so no hooks. | `clawhub skill publish ./skills/cockney --slug cockney --name "Cockney" --version 0.1.0 --categories development,agents --topics "terse,minimal-code,code-review,persona" --dry-run`, then the same command without `--dry-run`. Check with `clawhub inspect @<handle>/cockney`. | ponytail yes, by its author: [clawhub.ai/dietrichgebert/skills/ponytail](https://clawhub.ai/dietrichgebert/skills/ponytail). caveman only as third-party re-uploads | Now (decide on MIT-0 first) |
| 8 | **[sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills)** (47.5k★; 95 of the last 100 PRs merged) | vendored skill registry | PR that **copies** SKILL.md into `skills/cockney/` with the repo's frontmatter. `npm run validate`. | Follows docs/contributors/skill-template.md. Source-only PR (no CATALOG.md or index files). Enable "Allow edits from maintainers". | PR adding `skills/cockney/SKILL.md` with the extra frontmatter `category: development`, `risk: safe`, `source: community`, `source_repo: Kadajett/cockney`, `source_type: community`, `date_added`, `author: Kadajett`, `tags: [coding-style, minimal-diff, persona]`, `tools: [claude, codex]`. Commit message `feat: add cockney for terse minimal-diff coding`. | neither | Now (the copy drifts from upstream and has no hooks) |
| 9 | **[SkillsMP](https://skillsmp.com)** (independent, claims 3M+ SKILL.md files) | aggregator | **Auto** GitHub crawl. No form. | A public SKILL.md. No star minimum. | Nothing to do. Check `curl 'https://skillsmp.com/api/v1/skills/search?q=cockney&sortBy=recent'`. | both: [caveman](https://skillsmp.com/creators/juliusbrussee/caveman), [ponytail](https://skillsmp.com/creators/dietrichgebert/ponytail) | Auto |
| 10 | **[claudemarketplaces.com](https://claudemarketplaces.com)** (Mert Duzgun; claims ~380k visitors/month) | aggregator | **Auto**: marketplaces from GitHub, skills from skills.sh install counts. No form. | A valid `.claude-plugin/marketplace.json`, which cockney has. Skill pages need skills.sh installs. | Nothing to do. Expected page: claudemarketplaces.com/skills/kadajett/cockney/cockney. | both (skills): [caveman](https://claudemarketplaces.com/skills/juliusbrussee/caveman/caveman), [ponytail](https://claudemarketplaces.com/skills/DietrichGebert/ponytail/ponytail) | Auto |
| 11 | **[Gemini CLI extension gallery](https://geminicli.com/extensions)** (official Google) | aggregator | **Auto**: a daily crawl of public repos with the **`gemini-cli-extension` topic** and a valid root `gemini-extension.json`. | Root `gemini-extension.json` (name, version, description). `skills/<name>/SKILL.md` is exposed as a skill automatically. **Hazard:** Gemini auto-loads `hooks/hooks.json` with a different schema (timeout in ms, no `CLAUDE_PLUGIN_ROOT`, BeforeAgent rather than UserPromptSubmit), so do R6 first. Reach is shrinking: Gemini CLI stopped serving consumer and free tiers on 2026-06-18 and moved them to Antigravity CLI, which imports Gemini extensions. | R6 + R8, then `gh repo edit Kadajett/cockney --add-topic gemini-cli-extension`. Users install with `gemini extensions install https://github.com/Kadajett/cockney`. | both (in the gallery page data) | Later (R6, R8) |
| 12 | **[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)** (35.5k★) | awesome list | PR to README.md, title `Add skill: Kadajett/cockney` | "Brand new skills that were just created are not accepted… give your skill time to mature and gain users". Description ≤ 10 words. Append to the end of a Community Skills subcategory. | Line in §3, under Community Skills → Context Engineering. | neither (a 4★ caveman-style skill, cavemenko, is listed) | Later (after real usage) |
| 13 | **[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)** / aitmpl.com (32.6k★) | CLI installer | PR that vendors `cli-tool/components/skills/development/cockney/SKILL.md` | Contributions are MIT. The body cites the upstream source (as in merged PR #880). Skill only, no hooks. | PR adding that file (a copy of skills/cockney/SKILL.md) with the body "Adds the cockney skill (source: https://github.com/Kadajett/cockney, MIT) …". It then installs with `npx claude-code-templates@latest --skill development/cockney --yes`. | neither | Now |
| 14 | **[composio-community/awesome-codex-skills](https://github.com/composio-community/awesome-codex-skills)** (16.9k★) | awesome list | PR to README.md | "Add real, reusable skills". The description must state when Codex triggers. No star rule. | Line in §3, under `### Development & Code Tools`. | neither | After R14 (live Codex test). Last merge was 2026-07-26 |
| 15 | **[travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)** (15.4k★) | awesome list | PR, one item each | **< 10★ auto-closed.** PRs must not be AI-generated or AI-submitted, and the submitter has to acknowledge this. No trivial one-session skills. More than a single SKILL.md is preferred, which cockney has (hooks, eval). | At 10★, a human opens a PR with the row in §3. | neither | Later (10★). Maintainer dormant since 2026-04 |
| 16 | **[BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills)** (10.2k★) | awesome list | PR. The maintainer batch-imports from open PRs every couple of months, so the PR closes rather than merges. | An unpublished "star threshold". Must be skill-only, well formatted and not a duplicate. | PR with the line in §3, appended to `## 🛠 Development & Code Tools`. | neither | Now (may wait for stars) |
| 17 | **[Cursor Marketplace](https://cursor.com/marketplace)** (official) | plugin marketplace | Web form [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish), manual review | `.cursor-plugin/plugin.json` or a root `plugin.json`. Kebab-case unique name, README, logo, relative paths, tested locally. Cursor parses `hooks/hooks.json` with camelCase events, so do R6 first. | R6 + R10, then submit the repo URL. | unknown (slug checks returned "Not Found") | Later (R6, R10) |
| 18 | **[alvinreal/awesome-opensource-ai](https://github.com/alvinreal/awesome-opensource-ai)** (4.9k★; 92 of the last 100 PRs merged) | awesome list | PR plus the CONTRIBUTING checklist; run `python3 tools/validate_awesome.py --skip-remote` | No star minimum. Needs "meaningful distinction from similar projects" (caveman is already listed, so stress the minimal-diff and safety-drop angle). One factual sentence. | Line in §3, appended to `## 13 … #### IDE Plugins & Extensions`. | caveman yes (line ~1401); ponytail no | Now |
| 19 | **[ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering)** (4.8k★) | awesome list | PR, though the maintainer adds most entries himself | Must address a harness problem. Format `- [Title](URL) — 1–2 sentence note` (em dash). | Line in §3, under `### Skills & MCP`. | ponytail yes (`### Skills & MCP`) | Now (low PR merge rate) |
| 20 | **[buildwithclaude.com](https://buildwithclaude.com)** ([davepoon/buildwithclaude](https://github.com/davepoon/buildwithclaude), 3.6k★, very active) | plugin marketplace + indexer | (a) **Auto** daily cron: GitHub code search for `.claude-plugin/marketplace.json` plus **topic** search (claude-code-skill, claude-code-skills, claude-skill, agent-skill, agent-skills, anthropic-skill, claude-agent-skill, claude-code-plugins). (b) Optional PR to its marketplace.json. | PR: branch `add-cockney`, title `Add cockney plugin`, body with Summary / Component Details / Testing / Examples. A content scanner flags `curl \| sh` and `rm -rf $VAR`. | Auto after R3 (topics). Optional PR: append the JSON in §3 to `.claude-plugin/marketplace.json` `plugins`. | both auto-indexed: [caveman](https://buildwithclaude.com/marketplaces?q=Caveman), [ponytail](https://buildwithclaude.com/marketplaces?q=Ponytail) | Auto / Now |
| 21 | **[Tessl Registry](https://tessl.io/registry)** (Tessl AI Ltd, London; Snyk scores) | registry | **Auto** import, or the web form [tessl.io/registry/skills/submit](https://tessl.io/registry/skills/submit) | A public SKILL.md. The form probably needs a login [unverified]. | Optionally paste `https://github.com/Kadajett/cockney` into the form. Preview locally with `npx tessl review run ./skills/cockney`. | both: [caveman](https://tessl.io/registry/skills/github/JuliusBrussee/caveman), [ponytail](https://tessl.io/registry/skills/github/DietrichGebert/ponytail) | Auto / Now |
| 22 | **[LobeHub Skills](https://lobehub.com/skills)** (LobeHub, the LobeChat makers) | aggregator | **Auto** ("we monitor … GitHub Agent Skills") | A public SKILL.md. Shows the GitHub license, so do R1. | Nothing to do. Expected page: lobehub.com/skills/kadajett-cockney-cockney. | both: [caveman](https://lobehub.com/skills/juliusbrussee-caveman-caveman), [ponytail](https://lobehub.com/skills/dietrichgebert-ponytail-ponytail) | Auto |
| 23 | **[claude-plugins.dev](https://claude-plugins.dev)** ([Kamalnrf/claude-plugins](https://github.com/Kamalnrf/claude-plugins), 563★) | aggregator + CLI | **Auto**, hourly GitHub indexing of `.claude-plugin/marketplace.json` and `skills/*/SKILL.md` | Metadata (keywords, homepage, license) is pulled from the marketplace entry, so do R5. | Nothing to do. Check `curl 'https://claude-plugins.dev/api/plugins?q=cockney'`. It installs with `npx skills-installer install @Kadajett/cockney/cockney`. Ignore the optional "GitHub Token Pool" OAuth ask; listing doesn't need it. | both (skills): [caveman](https://claude-plugins.dev/skills/@JuliusBrussee/caveman/caveman), [ponytail](https://claude-plugins.dev/skills/@DietrichGebert/ponytail/ponytail) | Auto |
| 24 | **[ClaudePluginHub](https://www.claudepluginhub.com)** (anonymous team, 228k sitemap URLs) | directory | **Auto**, plus a one-field form [tools/submit-plugin](https://www.claudepluginhub.com/tools/submit-plugin) that skips GitHub's indexing lag | A public repo with `.claude-plugin/plugin.json`. | Paste `https://github.com/Kadajett/cockney` into the form. | both: [caveman](https://www.claudepluginhub.com/plugins/juliusbrussee-caveman), [ponytail](https://www.claudepluginhub.com/plugins/dietrichgebert-ponytail) | Now |
| 25 | **[quemsah/awesome-claude-plugins](https://github.com/quemsah/awesome-claude-plugins)** / awesomeclaudeplugins.com (1.4k★, daily automation) | aggregator | **Auto**: GitHub code search for `.claude-plugin/marketplace.json` | The README shows only the top 100 by stars (needs about 15k★). The site has the full index. | Nothing to do. | both (README ranks 11 and 7) | Auto |
| 26 | **[Smithery skills](https://smithery.ai/skills)** (25k skills) | registry | API publish with an account | You must own the namespace. A `kadajett` namespace **already exists** (it holds nestjs-best-practices). SKILL.md is validated (422); whether that validation is strict is unverified. | `curl -X PUT https://api.smithery.ai/skills/kadajett/cockney -H "Authorization: Bearer $SMITHERY_API_KEY" -H 'Content-Type: application/json' -d '{"gitUrl":"https://github.com/Kadajett/cockney"}'` | neither | Now (weak signal) |
| 27 | **[composio-community/awesome-claude-plugins](https://github.com/composio-community/awesome-claude-plugins)** (1.9k★) | awesome list | PR to README.md (an external link is enough) | "Doesn't duplicate existing functionality", tested. | Line in §3, under `### Companion & Personality`. | neither | Now (300 open PRs; last merge 2026-07-26) |
| 28 | **[hashgraph-online/awesome-codex-plugins](https://github.com/hashgraph-online/awesome-codex-plugins)** (1.3k★; 97 of 100 merged; also acts as a Codex marketplace) | awesome list / Codex marketplace | PR with one README line (or the issue form plugin-submission.yml) | `.codex-plugin/plugin.json` with `composerIcon`, **SECURITY.md**, LICENSE, README, lockfiles, SHA-pinned Actions. HOL plugin-scanner score **≥ 80/130** (`pipx run plugin-scanner scan . --format text`). Alphabetical, one sentence, repo-root link. Vendor-run (pushes its own scanner). | After R9, R11 and R14, add the line in §3 under `### Development & Workflow` and put the scanner score in the PR. | neither | Later |
| 29 | **[abubakarsiddik31/claude-skills-collection](https://github.com/abubakarsiddik31/claude-skills-collection)** (1.1k★) | awesome list | PR, or an issue with name, description, category and link | No star or age rule. | Row in §3, under `## 💻 Development & Code Tools`. | ponytail yes (same section) | Now |
| 30 | **[ccplugins/awesome-claude-code-plugins](https://github.com/ccplugins/awesome-claude-code-plugins)** (970★) / claudecodeplugins.dev | awesome list + marketplace | PR to README and/or `.claude-plugin/marketplace.json` | "Contributions are welcome … submit your own marketplace". Merges in batches; dormant since 2026-08-12. | Line in §3, under `### Workflow Orchestration`. | neither | Now (slow) |
| 31 | **[JackyST0/awesome-agent-skills](https://github.com/JackyST0/awesome-agent-skills)** (651★) | awesome list | PR editing **both** README.md and README_ZH.md; `npm run check` | Community projects need **≥ 64★**. | Line in §3, under `## Development Tools` (plus a Chinese line in README_ZH.md). | neither | Later (64★) |
| 32 | **[RoggeOhta/awesome-codex-cli](https://github.com/RoggeOhta/awesome-codex-cli)** (548★) | awesome list | **Issue** works best (0 of 45 PRs merged; the maintainer resolves issues in batches) | Must be directly about Codex CLI and maintained. "Self-promotion without substance" is rejected. Star badge required. | Issue proposing the line in §3 for `## Skills > ### Specialized Skills`. | neither | After R14 |
| 33 | **[karanb192/awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills)** (544★; 88 of the last 100 PRs merged) | awesome list | PR (one skill per PR, with the template) or the issue form skill-submission.yml | Valid frontmatter, maintained in the last 6 months, tested with Claude, description ≤ 150 chars, alphabetical, no star counts or badges. Self-authored is OK ("I am the author" box). Low-star skills are accepted. | Row in §3, under `### Collaboration & Workflow`, between `clueless` and `communication-protocol-setup`. PR title `Add cockney to Collaboration & Workflow`. | neither | Now |
| 34 | **[jqueryscript/awesome-claude-code](https://github.com/jqueryscript/awesome-claude-code)** (527★, mirrored on scriptbyai.com) | awesome list | Maintainer-curated batches; no published process. An issue is the realistic route. | None published. | Issue "Add cockney to Agent Skills" with the line in §3. | both: caveman in `## 🧠 Agent Skills`, ponytail in `## 🔌 Claude Plugins` | Now (at the maintainer's discretion) |
| 35 | **[Piebald-AI/awesome-gemini-cli](https://github.com/Piebald-AI/awesome-gemini-cli)** (512★) and [awesome-gemini-cli-extensions](https://github.com/Piebald-AI/awesome-gemini-cli-extensions) (69★) | awesome lists | PR to README.md (bottom of the section) | Must relate to Gemini CLI, so it needs R8 and a tested Gemini install. | Lines in §3. | neither | Later (R6, R8) |
| 36 | **Skillshare**: [skills.omp.sh](https://skills.omp.sh) (the omp registry) | registry (CLI publish) | `omp skill publish` | Verified locally with `--dry-run`. (1) The current SKILL.md **fails**: `unexpected frontmatter field "argument-hint"` (closed field set). (2) Without that line it fails again: `"metadata.version" is required to publish (set it with omp skill version patch)`. (3) With both fixed it packs `@<scope>/cockney@x.y.z` as 1 file, 5.3 KB. Publishing needs a **stencil.so account** (`omp skill token …` → "a stencil.so account is required: run omp and use /login → Stencil"). omp's own docs label Stencil sign-in "invite only". Packages are scoped to the Stencil username. Only the root SKILL.md ships, so no hooks. | After R7: `omp skill publish ./skills/cockney --dry-run`, then `omp skill publish ./skills/cockney`. Users install with `omp skill install @<stencil-user>/cockney`. | neither. The registry search API returned **0 hits for every query** (caveman, ponytail, pdf, git, review, "a"), so it is effectively empty today | Now if you have Stencil access; reach ≈ 0 today |

Not in the table but worth knowing:
- **Self-hosted install paths that need no listing.** `claude plugin marketplace add Kadajett/cockney` already works. `codex plugin marketplace add Kadajett/cockney` reads `.agents/plugins/marketplace.json`, or the legacy `.claude-plugin/marketplace.json` (R9). `copilot plugin marketplace add Kadajett/cockney` reads `.claude-plugin/marketplace.json`. `npx openskills install Kadajett/cockney` works from any repo. Codex skill-only install: `python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Kadajett/cockney --path skills/cockney --name cockney`.
- **Passive aggregators that index on their own** and will probably pick cockney up; both comparables are on each. No action needed: [SkillHub](https://www.skillhub.club) (anonymous operator, Chinese audience), [SkillAgent](https://skillagent.dev) (Skopaq AI; optional GitHub-auth form at /submit), [claudeskills.info](https://claudeskills.info) (optional /submit; indexes stray `*SKILL.md` files, so do R2).
- **Weak but free submission forms.** Only if you want breadth: [MCP Market](https://mcpmarket.com/submit) (claims 1M+ visitors/month, but it is full of caveman/ponytail clones and runs a commercial "Sell Skills" upsell; the official ponytail is not listed) and [skillsdirectory.com/submit](https://www.skillsdirectory.com/submit) (GitHub sign-in, security-graded, paid Pro tier, 653k-URL sitemap; both comparables listed).

---

## 2. Skip list

| Venue | Why skip |
|---|---|
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Partner-only. The docs say it "doesn't take submissions through the directory portal". Neither comparable is in it. Use the directory portal (#1), which feeds `claude-community`. |
| claude.com/marketplace pages | Not a separate venue. "There's no separate Claude Marketplace submission". The old clau.de/plugin-directory-submission Console form now redirects to the directory docs. |
| [openai/skills](https://github.com/openai/skills) | README says "This repository is deprecated". `.curated` is OpenAI and partners only. |
| [openai/plugins](https://github.com/openai/plugins) | OpenAI-curated and partner only, with all merges by staff. Third parties use platform.openai.com/plugins (#5). |
| [agentskills.io](https://agentskills.io) | Spec and docs only, no directory. Note: its validator (`skills-ref`) allows only `name, description, license, compatibility, metadata, allowed-tools` and **rejects `argument-hint`**. |
| [SkillsLLM](https://skillsllm.com) | Sells paid "Featured Listing", has a sports-betting category, and auto-generates dozens of "X-vs-ponytail" SEO pages. Pay-to-rank / SEO farm. |
| [Skillstore](https://skillstore.io) | Ad-funded (AdSense), generates 10+ language copies of each skill page for SEO, and the operator is unidentified. |
| [Tons of Skills](https://tonsofskills.com) (jeremylongshore/tons-of-skills-marketplace) | Needs a bespoke SKILL.md spec (8 frontmatter fields and 7 fixed body sections) that conflicts with the Agent Skills format, and it mirrors and "curates" (modifies) third-party plugins. Neither comparable is listed. |
| [skills.directory](https://skills.directory) | Empty shell; the sitemap has 1 URL. |
| [agentskills.so](https://agentskills.so) | Dead (connection failed). |
| [playbooks.com/skills](https://playbooks.com/skills) | 404. |
| [SkillsDB](https://skillsdb.com) | Unrelated HR product. |
| [agent-skills.cc](https://agent-skills.cc), [claudeskills.org](https://www.claudeskills.org), [agentskills.in](https://www.agentskills.in) | Small curated subsets. Neither official comparable is listed (only third-party copies). Low value. |
| usmanskillsmd/skillsmp, yan-labs/skillsmp (GitHub) | 0–8★ repos impersonating the SkillsMP name. |
| [SkillKit](https://github.com/rohitg00/skillkit) marketplace | Stale since 2026-06; neither comparable is listed. |
| [add-skill](https://www.npmjs.com/package/add-skill) (npm) | Deprecated in favour of `npx skills add`. |
| [openskills](https://github.com/numman-ali/openskills) | No registry to join; it installs from any repo. Stale since 2026-01. |
| [KarelDO/awesome-codex](https://github.com/KarelDO/awesome-codex) | About the 2021 Codex model, not Codex CLI. |
| Antigravity Marketplace | Curated in-app with no public submission path documented. Gemini extensions reach it through `agy plugin import gemini`. |
| [heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills) | Dormant since 2026-04; 100+ open PRs; CONTRIBUTING includes a sponsorship pitch. |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | Not a skip, but deprioritised (#15): no merges since 2026-04 and a 10★ auto-close. |
| [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills) | No contribution process; 6 of 28 PRs merged. |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit), [skillmatic-ai/awesome-agent-skills](https://github.com/skillmatic-ai/awesome-agent-skills), [helloianneo/awesome-claude-code-skills](https://github.com/helloianneo/awesome-claude-code-skills), [itgoyo/awesome-agent-skills](https://github.com/itgoyo/awesome-agent-skills) | Stale (last push April–May 2026). |
| [karanb192/awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods) | Only JS "function hook" mods; cockney uses `type: command` hooks. |
| VoltAgent/awesome-*-subagents | Subagents only. |
| [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode), [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | Cockney has no OpenCode or DeepSeek-harness integration. |
| [cursor.directory](https://cursor.directory/plugins/new) | Community site behind a login wall and bot checkpoint; neither comparable is listed; ownership not verified. Optional at most. |
| LinklyAI/best-skills, EvanLi/Github-Ranking, ai-boost/awesome-prompts | Automatic rankings or maintainer-written derivatives. No way to submit; they follow adoption. |

**ClawHub** (#7) is legitimate but carries real risk, so weigh it before publishing:
- In Feb 2026 ("ClawHavoc") researchers found 341 malicious skills on it: [Koi](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting), [The Hacker News](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html), [Trend Micro](https://www.trendmicro.com/en/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html).
- Everything published there is forcibly relicensed MIT-0.
- Re-uploads under other handles are common: caveman's only listings are copies. Publishing first under your own handle is how you claim the name.

---

## 3. Exact entry text per list

All links use the default branch, `master`.

**hesreallyhim/awesome-claude-code.** Web issue form, filled in by a human, on or after 2026-10-26T01:51Z (or once the repo has 100★):
```
Display Name: Cockney
Category: Skills
Link: https://github.com/Kadajett/cockney
Author Name: Jeremy Stover
Author Link: https://github.com/Kadajett
Description: A Claude Code skill and plugin that makes the agent reply tersely in a Cockney voice and make the smallest correct change: reuse existing code, standard library before new dependencies, no speculative abstractions. The accent drops for plain-English warnings on security issues and destructive or irreversible actions; lite/full/guvnor levels persist per session via hooks.
```
Tick every required box and leave the final trap checkbox **unticked**. The rendered entry will be `- [Cockney](https://github.com/Kadajett/cockney) by [Jeremy Stover](https://github.com/Kadajett) - <description>`.

**ComposioHQ/awesome-claude-skills.** `### Development & Code Tools`, alphabetical between `Claude Code Terminal Title` and `Connect`. Do **not** use the word "token". PR title `Add cockney skill`.
```
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. *By [@Kadajett](https://github.com/Kadajett)*
```

**VoltAgent/awesome-agent-skills.** Append to the end of Community Skills → Context Engineering. ≤ 10 words. PR title `Add skill: Kadajett/cockney`.
```
- **[Kadajett/cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney)** - Terse Cockney replies, smallest correct change, plain-English risk warnings
```

**travisvn/awesome-claude-skills.** Once the repo has 10★, a human adds this to the Individual Skills table under `## 🌟 Community Skills`, before `_More community skills coming soon!_`. State in the PR that a human wrote it, and list prerequisites (Node ≥ 22.18 for the hooks) and the MIT license.
```
| **[cockney](https://github.com/Kadajett/cockney)** | Terse Cockney-voiced coding mode: smallest correct change, plain-English warnings for anything risky |
```

**BehiSecc/awesome-claude-skills.** Append to `## 🛠 Development & Code Tools`.
```
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky.
```

**karanb192/awesome-claude-skills.** `### Collaboration & Workflow`, between `[clueless]` and `[communication-protocol-setup]`. ≤ 150 chars, no badges. PR title `Add cockney to Collaboration & Workflow`; fill in the template with author = Yes and what you tested.
```
| [cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney) | Reply tersely in a Cockney voice, make the smallest correct change, and flag risky steps in plain English. |
```

**alvinreal/awesome-opensource-ai.** Append to `## 13. Developer Tools & Integrations` → `#### IDE Plugins & Extensions`. The PR body must cover Project / Why it belongs / Quality signals.
```
- [Cockney](https://github.com/Kadajett/cockney) - Skill, Claude Code plugin and install script for omp, Claude Code and Codex that makes coding agents reply tersely in a Cockney voice and make the smallest correct change, with plain-English warnings for risky actions. MIT licensed. ![GitHub stars](https://img.shields.io/github/stars/Kadajett/cockney?style=social)
```

**ai-boost/awesome-harness-engineering.** `### Skills & MCP`, em-dash format.
```
- [Cockney](https://github.com/Kadajett/cockney) — Persona skill that pairs a minimal-diff ruleset (reuse, stdlib before dependencies, no speculative abstractions) with hook-enforced activation and level persistence, and drops the persona for plain-English warnings on destructive or security-relevant actions; ships a 19-task eval comparing it with caveman and ponytail.
```

**abubakarsiddik31/claude-skills-collection.** Append to the table under `## 💻 Development & Code Tools`.
```
| **cockney** | Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky, with lite/full/guvnor levels | [Source](https://github.com/Kadajett/cockney/tree/master/skills/cockney) |
```

**jqueryscript/awesome-claude-code.** Issue titled `Add cockney to Agent Skills`. The maintainer adds a `(N ⭐) - ` segment once the repo has stars.
```
- [**cockney**](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode for Claude Code and Codex: terse replies, the smallest correct change, plain-English warnings for anything risky.
```

**ccplugins/awesome-claude-code-plugins.** Append to `### Workflow Orchestration`.
```
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. Install via `/plugin marketplace add Kadajett/cockney`.
```

**composio-community/awesome-claude-plugins.** `### Companion & Personality` (alternative: `### Developer Productivity`).
```
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding persona for Claude Code: terse replies, the smallest correct change, and plain-English warnings for anything risky. Skill plus SessionStart/UserPromptSubmit hooks with /cockney lite|full|guvnor|off levels.
```

**composio-community/awesome-codex-skills.** `### Development & Code Tools`, between `bringyour-migration-auditor` and `codebase-migrate/`. Submit only after a live Codex test (R14).
```
- [cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. Install: `python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Kadajett/cockney --path skills/cockney --name cockney`
```

**RoggeOhta/awesome-codex-cli.** Proposed in an issue for `## Skills` → `### Specialized Skills`.
```
- [Kadajett/cockney](https://github.com/Kadajett/cockney) - Cockney-voiced skill for terse Codex replies and the smallest correct change, with plain-English warnings for risky actions. ![GitHub stars](https://img.shields.io/github/stars/Kadajett/cockney?style=flat-square)
```

**hashgraph-online/awesome-codex-plugins.** `### Development & Workflow`, alphabetical. Add only after R9, R11 and a scanner score ≥ 80.
```
- [Cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode with terse replies, the smallest correct change, and plain-English warnings for anything risky.
```

**JackyST0/awesome-agent-skills.** `## Development Tools`, once the repo has 64★. Add the same entry with a Chinese description to README_ZH.md.
```
- [cockney](https://github.com/Kadajett/cockney) - Terse Cockney-voiced coding mode: smallest correct change, plain-English warnings for risky steps.
```

**Piebald-AI/awesome-gemini-cli.** Bottom of `## Commands & Extensions`, after R8. Use the same line at the bottom of `## Utilities` in **awesome-gemini-cli-extensions**.
```
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, and plain-English warnings for anything risky. Install via `gemini extensions install https://github.com/Kadajett/cockney`.
```

**davepoon/buildwithclaude.** Optional PR: append to the `plugins` array in `.claude-plugin/marketplace.json`. Branch `add-cockney`, title `Add cockney plugin`. Pin `sha` to the release commit.
```json
{"name":"cockney","description":"Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.","version":"0.1.0","author":{"name":"Jeremy Stover","url":"https://github.com/Kadajett"},"homepage":"https://github.com/Kadajett/cockney","repository":"https://github.com/Kadajett/cockney","license":"MIT","keywords":["cockney","terse","minimal","code-style","persona","claude-code"],"category":"productivity","source":{"source":"github","repo":"Kadajett/cockney","sha":"<40-char release sha>"}}
```

**sickn33/agentic-awesome-skills.** Vendored file `skills/cockney/SKILL.md`: the current body plus this frontmatter.
```yaml
name: cockney
description: <current description>
category: development
risk: safe
source: community
source_repo: Kadajett/cockney
source_type: community
date_added: "<YYYY-MM-DD>"
author: Kadajett
tags: [coding-style, minimal-diff, persona]
tools: [claude, codex]
```

---

## 4. Repo changes needed first

The priority order follows how many venues each change unblocks. P0 changes are cheap and help everywhere.

### P0

**R1. Make LICENSE plain MIT.** Delete the trailing paragraph that starts `eval/arms/caveman.SKILL.md is from github.com/JuliusBrussee/caveman (Apache-2.0)` and move it to `eval/arms/SOURCES.txt` or a new `eval/arms/NOTICE`. GitHub currently detects the license as `Other` / `NOASSERTION`. LobeHub, SkillAgent, ClaudePluginHub, claude-plugins.dev and list reviewers all show GitHub's license field. caveman detects as Apache-2.0 and ponytail as MIT.

**R2. Rename the vendored comparison skills** `eval/arms/caveman.SKILL.md` → `eval/arms/caveman.md` and `eval/arms/ponytail.SKILL.md` → `eval/arms/ponytail.md`. Update `eval/src/arms.ts` (lines 25 and 42, the `vendored("….SKILL.md")` calls) and the R1 attribution text. Suffix-matching crawlers would otherwise publish caveman's and ponytail's text as skills under Kadajett/cockney. claudeskills.info already does exactly this to ponytail's `benchmarks/arms/caveman-SKILL.md`.

**R3. GitHub topics and homepage.** The repo has none today. GitHub allows at most 20 topics. Add `gemini-cli-extension` only after R6 and R8.
```
gh repo edit Kadajett/cockney --homepage "https://github.com/Kadajett/cockney#readme" \
  --add-topic claude-code --add-topic claude-code-plugin --add-topic claude-code-plugins \
  --add-topic claude-code-skill --add-topic claude-code-skills --add-topic claude-skill --add-topic claude-skills \
  --add-topic agent-skills --add-topic agent-skill --add-topic skill --add-topic codex --add-topic codex-skills \
  --add-topic prompt-engineering --add-topic llm --add-topic developer-tools
```
- The buildwithclaude indexer searches the topics `claude-code-skill, claude-code-skills, claude-skill, agent-skill, agent-skills, anthropic-skill, claude-agent-skill, claude-code-plugins`.
- The Gemini gallery crawls `gemini-cli-extension`.
- Topic sizes (repos): claude-code 89k, agent-skills 31k, skills 16k, claude-skills 10.7k, claude-code-plugin 9.6k, claude-skill 6.0k, agent-skill 5.1k, claude-code-skill 3.3k.
- ponytail uses `agent-skills, ai-agents, claude, claude-code, claude-code-plugin, cursor-rules, developer-tools, llm, prompt-engineering, yagni`. caveman uses `ai, anthropic, caveman, claude, claude-code, llm, meme, prompt-engineering, skill, tokens`.

**R4. README fixes.**
1. Line 67: replace the placeholder `claude plugin marketplace add <this repo>` with `claude plugin marketplace add Kadajett/cockney`, then `claude plugin install cockney@cockney`.
2. Add a one-line skills.sh install, `npx skills add Kadajett/cockney`, and the badge `[![skills.sh](https://skills.sh/b/Kadajett/cockney)](https://skills.sh/Kadajett/cockney)`. The skills.sh listing only exists once people install through the CLI.
3. Add a short **"What it runs"** section, which the Anthropic directory's security scan needs. It should say:
   - `hooks/hooks.json` runs `node ${CLAUDE_PLUGIN_ROOT}/hooks/claude.ts` on SessionStart and on every UserPromptSubmit, injecting the ruleset or a one-line reminder as additionalContext.
   - It writes the per-session level to `~/.config/cockney/sessions/<session_id>` (override with `COCKNEY_STATE_DIR`).
   - It makes no network calls. It needs Node ≥ 22.18 and is skipped if node is missing.
   - `install.sh`, not the plugin, edits `~/.claude/settings.json` through `hooks/claude-settings.ts`.

**R5. Richer Claude manifests.** Fuller metadata gives crawlers and the directory more to show; claude-plugins.dev shows caveman's keywords, homepage and license as null because its manifest lacks them. The researcher ran `claude plugin validate --strict` on Claude Code 2.1.286 in a temp clone, and it passes for both files below. Rules: do **not** add `version` to the marketplace entry, and do not rename `name` (the install id is `cockney@cockney`).

`.claude-plugin/plugin.json`:
```json
{
  "name": "cockney",
  "displayName": "Cockney",
  "version": "0.1.0",
  "description": "Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.",
  "author": { "name": "Jeremy Stover", "url": "https://github.com/Kadajett" },
  "homepage": "https://github.com/Kadajett/cockney#readme",
  "repository": "https://github.com/Kadajett/cockney",
  "license": "MIT",
  "keywords": ["cockney", "terse", "concise", "minimal", "yagni", "code-style", "token-saving", "persona", "skill"],
  "icon": "./assets/logo.png",
  "documentationUrl": "https://github.com/Kadajett/cockney#readme",
  "supportUrl": "https://github.com/Kadajett/cockney/issues"
}
```
`.claude-plugin/marketplace.json`:
```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "cockney",
  "description": "Cockney: a cheeky coding-agent skill. Terse replies, the smallest correct change, plain English for anything risky.",
  "owner": { "name": "Jeremy Stover", "url": "https://github.com/Kadajett" },
  "plugins": [
    {
      "name": "cockney",
      "displayName": "Cockney",
      "description": "Terse Cockney replies, minimal code, plain-English safety warnings.",
      "source": "./",
      "category": "productivity",
      "tags": ["coding-style", "terse", "minimal-diff", "token-saving", "persona"],
      "author": { "name": "Jeremy Stover", "url": "https://github.com/Kadajett" },
      "homepage": "https://github.com/Kadajett/cockney#readme",
      "repository": "https://github.com/Kadajett/cockney",
      "license": "MIT",
      "keywords": ["cockney", "terse", "concise", "minimal", "yagni", "code-style", "token-saving", "persona", "skill"]
    }
  ]
}
```

### P1: needed by specific venues

**R6. Rename `hooks/hooks.json` → `hooks/claude-hooks.json`** and add `"hooks": "./hooks/claude-hooks.json"` to `.claude-plugin/plugin.json`. Leave the content unchanged; nothing in `install.sh`, `package.json` or the README references the file. This is required before the Gemini gallery (#11), Cursor (#17) and awesome-copilot (#4):
- Gemini CLI, Cursor and Copilot CLI all auto-load `hooks/hooks.json` with their own schemas.
- Gemini reads `"timeout": 10` as **10 ms**, has no `CLAUDE_PLUGIN_ROOT`, and uses `BeforeAgent`. Cursor uses camelCase events.
- ponytail solves the same problem by naming its file `hooks/claude-codex-hooks.json`.

Codex also auto-discovers `hooks/hooks.json` (and sets `CLAUDE_PLUGIN_ROOT`), so after the rename R9's `.codex-plugin/plugin.json` must point at the file explicitly.

⚠ Verify after the change that Claude Code still fires both hooks: `claude --plugin-dir .` and a live turn.

**R7. SKILL.md frontmatter, for Skillshare (#36) and spec-strict consumers.**
- Remove `argument-hint: "[lite|full|guvnor|off]"`. It is the only non-spec key. Skillshare hard-fails on it, and so do the agentskills.io `skills-ref` validator and claude.ai skill upload. The cost is losing the argument autocomplete hint for `/cockney` in Claude Code. skills.sh, SkillsMP and others tolerate it (ponytail keeps it).
- Add the version Skillshare requires:
```yaml
license: MIT
metadata:
  version: 0.1.0
```
Verified on a temp copy: with `argument-hint` dropped and `metadata.version` added, `omp skill publish <dir> --dry-run` gives `@<scope>/cockney@… 1 files, 5.3KB … dry run: nothing published`.

**R8. `gemini-extension.json`** at the repo root, plus the `gemini-cli-extension` topic, for #11 and #35. `skills/cockney/SKILL.md` is exposed automatically. For always-on behaviour like caveman (GEMINI.md) and ponytail (AGENTS.md), also commit a root `GEMINI.md` containing the full ruleset, generated from `hooks/ruleset.ts`, and add `"contextFileName": "GEMINI.md"`.
```json
{
  "name": "cockney",
  "version": "0.1.0",
  "description": "Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky."
}
```

**R9. Codex manifests**, for the Codex marketplace, OpenAI directory (#5) and hashgraph (#28). This follows ponytail's layout. `displayName` and `shortDescription` must be ≤ 30 chars.

`.codex-plugin/plugin.json`. For the OpenAI directory ZIP, remove `hooks` and `"Lifecycle hooks"` and leave `hooks/` out of the ZIP.
```json
{
  "name": "cockney",
  "version": "0.1.0",
  "description": "Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.",
  "author": { "name": "Jeremy Stover", "url": "https://github.com/Kadajett" },
  "homepage": "https://github.com/Kadajett/cockney",
  "repository": "https://github.com/Kadajett/cockney",
  "license": "MIT",
  "keywords": ["terse", "minimalism", "code-review", "productivity"],
  "skills": "./skills/",
  "hooks": "./hooks/claude-hooks.json",
  "interface": {
    "displayName": "Cockney",
    "shortDescription": "Terse Cockney coding mode",
    "longDescription": "Terse replies, the smallest correct change, and plain-English warnings for anything risky. Levels: lite, full, guvnor.",
    "developerName": "Jeremy Stover",
    "category": "Productivity",
    "capabilities": ["Instructions", "Lifecycle hooks"],
    "websiteURL": "https://github.com/Kadajett/cockney",
    "composerIcon": "./assets/logo.png",
    "logo": "./assets/logo.png"
  }
}
```
`.agents/plugins/marketplace.json`. Note `ref` is `master`, not `main`.
```json
{
  "name": "cockney",
  "interface": { "displayName": "Cockney" },
  "plugins": [
    {
      "name": "cockney",
      "source": { "source": "url", "url": "https://github.com/Kadajett/cockney.git", "ref": "master" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

**R10. `.cursor-plugin/plugin.json`** (optional, for #17):
```json
{
  "name": "cockney",
  "version": "0.1.0",
  "description": "Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.",
  "author": { "name": "Jeremy Stover" },
  "license": "MIT",
  "logo": "assets/logo.png"
}
```

**R11. `SECURITY.md` and an icon**, for hashgraph (#28). SECURITY.md should be a short disclosure policy: how to report (GitHub private vulnerability reporting), and supported version 0.1.x. Also add `assets/icon.svg` (SVG preferred, 512×512) of the existing logo.

**R12. Move `eval/` and `research/` out of the plugin root** (optional, for #1). The plugin source is `./`, so the whole repo is the plugin folder. `eval/results/*/records.jsonl` (up to about 2.8 MB) and `eval/tasks/safety-migration-data/repo/app.db` (binary) make every version a "held for reviewer" case. Moving them to another repo or an orphan branch avoids that. Do **not** use `.gitattributes export-ignore` instead, because it stops portal validation. Do not move the plugin into a subfolder either: hooks that run `.ts` from a subfolder plugin get held.

**R13. Release tag**, for awesome-copilot (#4): `git tag v0.1.0 && git push origin v0.1.0`, then record the 40-char SHA. Bump `version` in every manifest on each release.

**R14. Live Codex test**, for the Codex lists (#14, #28, #32). The README says the Codex install is "files only: … no live turn". Codex lists require proven Codex support, so run a real Codex turn and update that README row before submitting.

**ClawHub licence decision** (#7): publishing relicenses the skill as MIT-0, and the docs say not to keep a conflicting `license: MIT` in SKILL.md. Either accept MIT-0 for the ClawHub copy or skip ClawHub.

---

## 5. Suggested order

1. **Today.** Do R1–R5 and push. Optionally submit to ClaudePluginHub (#24) and Tessl (#21). Open PRs or issues for karanb192 (#33), alvinreal (#18), abubakarsiddik31 (#29), BehiSecc (#16), ComposioHQ (#6), composio-community/awesome-claude-plugins (#27), ccplugins (#30) and jqueryscript (#34). Submit to the Anthropic directory (#1); it needs a paid claude.ai plan.
2. **Next.** Do R6–R10 and R13. Then: Gemini topic (#11), Skillshare `omp skill publish` (#36, needs Stencil access), awesome-copilot form (#4), Cursor form (#17), and Smithery PUT (#26) if wanted.
3. **2026-10-26 or later.** The hesreallyhim form (#3), with commits pushed in the meantime.
4. **After R14.** composio-community/awesome-codex-skills (#14), RoggeOhta (#32), hashgraph (#28, also needs R11) and the OpenAI directory (#5).
5. **Star-gated.** travisvn at 10★ (#15), JackyST0 at 64★ (#31), and VoltAgent once there is real usage (#12).
6. **Passive, no action.** skills.sh, SkillsMP, claudemarketplaces, LobeHub, claude-plugins.dev, quemsah, buildwithclaude, SkillHub, SkillAgent and claudeskills.info.

---

## Appendix: full per-venue research notes

These are the raw structured notes from the four research passes, including sources. Statements marked `[UNVERIFIED]` or `[INFERENCE]` were not confirmed from a primary page.

### Skill registries and aggregators

#### skills.sh (Vercel) + `skills` CLI
- **url**: https://www.skills.sh
- **type**: cli-installer
- **how_listed**: Auto, from install telemetry. A page at skills.sh/<owner>/<repo> appears once someone runs `npx skills add <owner>/<repo>` against a public GitHub repo. There is no submission form. The FAQ says: 'Skills appear on the leaderboard automatically through anonymous telemetry when users run npx skills add <owner/repo>'.
- **requirements**: The CLI looks for SKILL.md at the repo root, under skills/<name>/SKILL.md (walked up to 3 levels deep), in agent dirs like .claude/skills, and in skill paths declared in .claude-plugin/marketplace.json or plugin.json. Frontmatter needs string `name` and `description`; the CLI does not reject other keys (it parses name/description/metadata only). Telemetry only sends GitHub repo/skill ids when GitHub confirms the repo is public. It is off when DISABLE_TELEMETRY or DO_NOT_TRACK is set; CI runs are still sent, tagged ci=1. skills.sh runs routine security audits. No star minimum and no self-promotion rules found.
- **exact_action**: Nothing to submit. Users run `npx skills add Kadajett/cockney` (or `npx skills add Kadajett/cockney --skill cockney -a claude-code -y`). Verified: `DISABLE_TELEMETRY=1 npx skills add Kadajett/cockney --list` printed 'Found 1 skill … cockney' with the full description. As of now https://www.skills.sh/kadajett/cockney returns 404 (no installs recorded yet). README badge per skills.sh/docs: `[![skills.sh](https://skills.sh/b/Kadajett/cockney)](https://skills.sh/Kadajett/cockney)` (the badge endpoint already returns 200).
- **caveman_listed**: https://www.skills.sh/juliusbrussee/caveman (25 skills, 4.1M total installs)
- **ponytail_listed**: https://www.skills.sh/dietrichgebert/ponytail (6 skills, 252.0K total installs)
- **legitimacy**: Run by Vercel. CLI repo vercel-labs/skills: 33,866 stars, created 2026-01-14, last push 2026-10-09, MIT. The agentskills.io spec README links to skills.sh as the 'Skills Directory'.
- **red_flags**: No organic listing until real installs happen. Running installs ourselves to seed the leaderboard would be gaming the ranking; README install instructions are the legitimate route.
- **reach_estimate**: npm `skills`: 25,152,704 downloads from 2026-09-11 to 2026-10-10 (api.npmjs.org). This is the main install path for the ecosystem.
- **sources**: https://github.com/vercel-labs/skills · https://raw.githubusercontent.com/vercel-labs/skills/main/src/telemetry.ts · https://raw.githubusercontent.com/vercel-labs/skills/main/src/skills.ts · https://www.skills.sh/docs · https://www.skills.sh/docs/faq · https://www.skills.sh/docs/cli · https://www.skills.sh/juliusbrussee/caveman · https://www.skills.sh/dietrichgebert/ponytail · https://api.npmjs.org/downloads/point/last-month/skills

#### SkillsMP (Skills Marketplace)
- **url**: https://skillsmp.com
- **type**: aggregator
- **how_listed**: Auto-crawls public GitHub repos for SKILL.md files ('Collect 3M+ SKILL.md files from public GitHub repositories'). There is no submission form (/submit returns 404) and no documented way to request inclusion.
- **requirements**: A public GitHub repo containing SKILL.md. No star minimum: 26 of the 50 most recent entries in the API sample (sortBy=recent) come from repos with 0 stars. Search can filter on marketplace.json, stars and update time. The refresh interval is not documented; the ponytail page says 'SkillsMP catalog refreshed October 6, 2026'.
- **exact_action**: Nothing to do; wait for the crawl. Check with `curl 'https://skillsmp.com/api/v1/skills/search?q=cockney&sortBy=recent'`. https://skillsmp.com/creators/kadajett/cockney returns 404 today. Note: Kadajett/agent-nestjs-skills (288 stars) is not on SkillsMP either, so coverage is uneven.
- **caveman_listed**: https://skillsmp.com/creators/juliusbrussee/caveman (the API also returns JuliusBrussee/caveman skills/caveman and plugins/caveman/skills/caveman)
- **ponytail_listed**: https://skillsmp.com/creators/dietrichgebert/ponytail (12 skills)
- **legitimacy**: An independent one-person community project (X @God_I_13, ko-fi godi13), not affiliated with Anthropic or OpenAI. Offers a REST API, an MCP server and 9 languages; claims 3M+ skills.
- **red_flags**: Unrelated GitHub repos copy its name (usmanskillsmd/skillsmp with 0 stars, yan-labs/skillsmp); ignore those. No way to force indexing. No quality gate.
- **reach_estimate**: Claims 3M+ skills and is the most-cited aggregator. No traffic figures published.
- **sources**: https://skillsmp.com/ · https://skillsmp.com/about · https://skillsmp.com/llms-full.txt · https://skillsmp.com/creators/dietrichgebert/ponytail · https://skillsmp.com/api/v1/skills/search?q=caveman&limit=5

#### Smithery Skills Registry
- **url**: https://smithery.ai/skills
- **type**: registry
- **how_listed**: Publish through the API. PUT https://api.smithery.ai/skills/{namespace}/{slug} with JSON {"gitUrl": "..."} and an API key (Bearer). The CLI's skill commands only cover `search` and `add`; no publish command is documented. Some namespaces look bulk-imported (openclaw, neversight, aiskillstore), but whether Smithery crawls GitHub on its own is [UNVERIFIED].
- **requirements**: You need a Smithery account and must own the namespace (403 otherwise). gitUrl must point to a GitHub repo containing SKILL.md (404 if missing). A git URL can only be claimed once (409). SKILL.md is validated (422 on failure); which rules apply is [UNVERIFIED].
- **exact_action**: Requires login, so do not do it here. Once signed in: `curl -X PUT https://api.smithery.ai/skills/kadajett/cockney -H 'Authorization: Bearer $SMITHERY_API_KEY' -H 'Content-Type: application/json' -d '{"gitUrl":"https://github.com/Kadajett/cockney"}'`. A `kadajett` namespace already exists: it holds nestjs-best-practices → https://github.com/Kadajett/agent-nestjs-skills, listed=true, created 2026-02-03, so the user probably already has an account.
- **caveman_listed**: no (namespace=juliusbrussee returns [] and text search finds no caveman entry)
- **ponytail_listed**: no (namespace=dietrichgebert returns [])
- **legitimacy**: Long-running MCP server registry that added skills later. 25,121 skills in the registry. GitHub smithery-ai/cli now redirects to arcadeai-labs/smithery-cli (840 stars, created 2024-12-22, last push 2026-05-31).
- **red_flags**: The CLI repo moved to the arcadeai-labs org, so ownership may have changed [INFERENCE]. Neither comparable repo is listed, which makes it a weaker signal. Publishing is manual and needs an account.
- **reach_estimate**: Moderate. Known for MCP, less used for skills.
- **sources**: https://smithery.ai/docs/llms.txt · https://smithery.ai/docs/api-reference/skills/create-or-update-a-skill.md · https://smithery.ai/docs/concepts/cli.md · https://api.smithery.ai/skills?namespace=kadajett&pageSize=5 · https://api.smithery.ai/skills?pageSize=1

#### LobeHub Skills Marketplace
- **url**: https://lobehub.com/skills
- **type**: aggregator
- **how_listed**: Auto-index. The site says 'We monitor a range of sources for new GitHub Agent Skills'. No submission form found.
- **requirements**: A public GitHub SKILL.md. Each page shows GitHub stars, forks and license. Skill ids look like <owner>-<repo>-<skill>.
- **exact_action**: Nothing to do. The page will appear at https://lobehub.com/skills/kadajett-cockney-cockney once indexed (unknown slugs return 404).
- **caveman_listed**: https://lobehub.com/skills/juliusbrussee-caveman-caveman
- **ponytail_listed**: https://lobehub.com/skills/dietrichgebert-ponytail-ponytail
- **legitimacy**: Run by LobeHub (lobehub org, maker of LobeChat). Install via `npx @lobehub/market-cli`.
- **red_flags**: Its star counts are stale (shows caveman at 41,381 stars versus 111k actual). No way to submit.
- **reach_estimate**: Moderate to high; benefits from LobeChat's user base. Install counts on pages are low (caveman: 31).
- **sources**: https://lobehub.com/skills/juliusbrussee-caveman-caveman · https://lobehub.com/skills?q=github

#### Tessl Registry
- **url**: https://tessl.io/registry
- **type**: registry
- **how_listed**: Auto-imports public GitHub skills under github/<owner>/<repo>. There is also a web form at https://tessl.io/registry/skills/submit ('Paste a public repo URL and Tessl will scan it automatically. The skill gets added to the open registry').
- **requirements**: A public GitHub repo with SKILL.md. Tessl evaluates skills and shows Snyk security scores. Login appears needed to submit through the form [UNVERIFIED].
- **exact_action**: Either wait, or open https://tessl.io/registry/skills/submit → 'Analyze a repository' → paste https://github.com/Kadajett/cockney. The listing would then be at https://tessl.io/registry/skills/github/Kadajett/cockney. Local dry run without publishing: `npx tessl review run ./skills/cockney`.
- **caveman_listed**: https://tessl.io/registry/skills/github/JuliusBrussee/caveman
- **ponytail_listed**: https://tessl.io/registry/skills/github/DietrichGebert/ponytail
- **legitimacy**: Tessl AI Ltd, a London company (address in the page footer) with a funded product, docs at docs.tessl.io, and Snyk security scoring.
- **red_flags**: none found
- **reach_estimate**: Moderate; developer-tooling audience with a CLI (`tessl i github:owner/repo`).
- **sources**: https://tessl.io/registry/skills/submit · https://tessl.io/blog/skills-are-software-and-they-need-a-lifecycle-introducing-skills-on-tessl · https://tessl.io/registry/skills/github/JuliusBrussee/caveman · https://tessl.io/registry/skills/github/DietrichGebert/ponytail

#### claude-plugins.dev (skills + plugins registry, skills-installer CLI)
- **url**: https://claude-plugins.dev/skills
- **type**: aggregator
- **how_listed**: Auto. The README says 'Our registry automatically discovers and indexes all public Claude Code plugins and agent skills on GitHub' (crawler hosted on val.town).
- **requirements**: A public GitHub repo with SKILL.md and/or .claude-plugin manifests.
- **exact_action**: Nothing to do. Pages will appear at https://claude-plugins.dev/skills/@Kadajett/cockney/cockney. Install command: `npx skills-installer install @Kadajett/cockney/cockney`. Kadajett skills from other repos are already listed (e.g. @Kadajett/agent-nestjs-skills/nestjs-best-practices).
- **caveman_listed**: https://claude-plugins.dev/skills/@JuliusBrussee/caveman/caveman
- **ponytail_listed**: https://claude-plugins.dev/skills/@DietrichGebert/ponytail/ponytail
- **legitimacy**: Kamalnrf/claude-plugins: 563 stars, created 2025-10-12, last push 2026-10-05. Claims 11,989 plugins and 63,065 skills.
- **red_flags**: Its CLI is small: npm skills-installer had 518 downloads last month.
- **reach_estimate**: Moderate web discovery; small CLI usage.
- **sources**: https://api.github.com/repos/Kamalnrf/claude-plugins/readme · https://claude-plugins.dev/sitemap.xml · https://claude-plugins.dev/skills/@DietrichGebert/ponytail/ponytail

#### SkillHub
- **url**: https://www.skillhub.club
- **type**: aggregator
- **how_listed**: Auto. Its FAQ says: 'Create a SKILL.md file following Anthropic's format, push to GitHub, and it will be automatically indexed by SkillHub.' No /submit page (404).
- **requirements**: SKILL.md in Anthropic format on public GitHub. Skills get AI ratings for instruction clarity and similar qualities.
- **exact_action**: Nothing to do. The page will appear at https://www.skillhub.club/skills/kadajett-cockney-cockney (404 today).
- **caveman_listed**: https://www.skillhub.club/skills/juliusbrussee-caveman-caveman
- **ponytail_listed**: https://www.skillhub.club/skills/dietrichgebert-ponytail-ponytail
- **legitimacy**: Operator not identified. The site has Xiaohongshu/RedSk post features, so it probably targets a Chinese audience [INFERENCE].
- **red_flags**: Anonymous operator.
- **reach_estimate**: Unknown; strongest with Chinese-speaking users [INFERENCE].
- **sources**: https://www.skillhub.club · https://www.skillhub.club/skills/juliusbrussee-caveman-caveman · https://www.skillhub.club/skills/dietrichgebert-ponytail-ponytail

#### Skills Directory (skillsdirectory.com)
- **url**: https://www.skillsdirectory.com
- **type**: directory
- **how_listed**: Auto-index of 100,000+ skills, each security-scanned before it appears with a public A–F grade. A sign-in form also exists at https://www.skillsdirectory.com/submit (sign in with GitHub).
- **requirements**: Public GitHub SKILL.md that passes the security scanner (credential theft, prompt injection, malware rules).
- **exact_action**: Either wait, or sign in with GitHub at https://www.skillsdirectory.com/submit and submit https://github.com/Kadajett/cockney. The page would be at https://www.skillsdirectory.com/skills/kadajett-cockney.
- **caveman_listed**: https://www.skillsdirectory.com/skills/juliusbrussee-caveman
- **ponytail_listed**: https://www.skillsdirectory.com/skills/dietrichgebert-ponytail
- **legitimacy**: Operator not identified on the About page. It has a paid 'Pro' tier.
- **red_flags**: Commercial upsell. Its sitemap has about 653k URLs, a sign of SEO-scale page generation.
- **reach_estimate**: Unknown.
- **sources**: https://www.skillsdirectory.com/about · https://www.skillsdirectory.com/submit · https://www.skillsdirectory.com/skills/juliusbrussee-caveman

#### SkillAgent
- **url**: https://skillagent.dev
- **type**: aggregator
- **how_listed**: Auto: crawls GitHub search hourly. A web form at https://skillagent.dev/submit needs GitHub auth.
- **requirements**: Public GitHub repo with a README and a SKILL.md/CLAUDE.md, plus a clear description. An open-source license is recommended and improves the quality score. Stars are capped at 20% of the score.
- **exact_action**: Either wait, or use https://skillagent.dev/submit (GitHub sign-in, repo URL https://github.com/Kadajett/cockney).
- **caveman_listed**: https://skillagent.dev/skill/JuliusBrussee/caveman
- **ponytail_listed**: https://skillagent.dev/skill/DietrichGebert/ponytail
- **legitimacy**: The About page says it is run by Skopaq AI (hello@skillagent.dev) and not affiliated with Anthropic, OpenAI or GitHub.
- **red_flags**: Has duplicate-slug pages (e.g. ponytail-d8oiq8, caveman-13tyfe).
- **reach_estimate**: Small to moderate [INFERENCE].
- **sources**: https://skillagent.dev/about · https://skillagent.dev/submit · https://skillagent.dev/skill/DietrichGebert/ponytail

#### Skillstore
- **url**: https://skillstore.io
- **type**: directory
- **how_listed**: Web form at https://skillstore.io/submit. It runs a security audit and 'create[s] a PR for review'. It also seems to auto-include popular repos, since both comparable repos are listed [INFERENCE].
- **requirements**: A valid SKILL.md. Skills with scripts get extra security review (cockney's hooks/omp.ts and install.sh may count as scripts [INFERENCE]). MIT/Apache or similar permissive license recommended.
- **exact_action**: https://skillstore.io/submit. Fields: 'GitHub Repository URL *' = https://github.com/Kadajett/cockney, 'Additional context (optional)', and an optional GitHub notification authorization. Anonymous submission is allowed.
- **caveman_listed**: https://skillstore.io/skills/juliusbrussee-caveman
- **ponytail_listed**: https://skillstore.io/skills/dietrichgebert-ponytail
- **legitimacy**: Operator not identified (hello@skillstore.io). Pages carry AdSense ads.
- **red_flags**: Ad-funded. Generates pages in 10+ languages per skill (SEO).
- **reach_estimate**: Unknown.
- **sources**: https://skillstore.io/submit · https://skillstore.io/about · https://skillstore.io/skills/juliusbrussee-caveman

#### Claude Skills Hub (claudeskills.info)
- **url**: https://claudeskills.info
- **type**: aggregator
- **how_listed**: Auto-index plus a review form at https://claudeskills.info/submit/.
- **requirements**: Open-source agent skill on GitHub.
- **exact_action**: Optionally submit https://github.com/Kadajett/cockney at https://claudeskills.info/submit/ (the form loads client-side; fields not captured). Otherwise wait.
- **caveman_listed**: https://claudeskills.info/skills/juliusbrussee/caveman/ (also /plugins/juliusbrussee/caveman/)
- **ponytail_listed**: https://claudeskills.info/skills/DietrichGebert/ponytail/ (also /plugins/DietrichGebert/ponytail/)
- **legitimacy**: Contact jeanhe@altescape.us. Offers a JSON API.
- **red_flags**: Indexes stray *SKILL.md files: it lists ponytail's benchmarks/arms/caveman-SKILL.md as a skill called 'arms' (https://claudeskills.info/skills/DietrichGebert/ponytail/arms/). Cockney's eval/arms/*.SKILL.md files are at the same risk (see repo_changes). It also hosts many caveman clones.
- **reach_estimate**: Unknown; about 74k URLs in its sitemap.
- **sources**: https://claudeskills.info/submit/ · https://claudeskills.info/about/ · https://claudeskills.info/sitemap.xml

#### MCP Market – Agent Skills
- **url**: https://mcpmarket.com/tools/skills
- **type**: directory
- **how_listed**: Web form at https://mcpmarket.com/submit ('Submit MCPs & Skills … Submit the related GitHub repository below and we'll review it'), plus partial auto-collection.
- **requirements**: A GitHub repo URL; reviewed by staff.
- **exact_action**: https://mcpmarket.com/submit → 'GitHub repo' tab → https://github.com/Kadajett/cockney.
- **caveman_listed**: Partly: https://mcpmarket.com/tools/skills/caveman-commit links to github.com/juliusbrussee/caveman. Most caveman-* pages are clones.
- **ponytail_listed**: no (none of the 17 ponytail-* skill pages reference DietrichGebert; all are third-party copies)
- **legitimacy**: Commercial MCP directory. Claims 1M+ monthly visitors, 35K+ MCP servers and 200K+ skills. Has a 'Sell Skills' marketplace.
- **red_flags**: Renames slugs (caveman-mode, caveman-token-optimizer-1). Full of clones. Commercial upsell.
- **reach_estimate**: Self-reported 1M+ monthly visitors.
- **sources**: https://mcpmarket.com/submit · https://mcpmarket.com/tools/skills/caveman-commit · https://mcpmarket.com/sitemap.xml

#### SkillsLLM
- **url**: https://skillsllm.com
- **type**: directory
- **how_listed**: Web form at https://skillsllm.com/submit ('Submit your open-source GitHub repository') plus curated repo-level entries.
- **requirements**: An open-source GitHub repo. The form renders client-side; fields not captured.
- **exact_action**: https://skillsllm.com/submit with https://github.com/Kadajett/cockney.
- **caveman_listed**: https://skillsllm.com/skill/caveman (links github.com/JuliusBrussee/caveman)
- **ponytail_listed**: https://skillsllm.com/skill/ponytail (links github.com/DietrichGebert/ponytail)
- **legitimacy**: Operator not identified. Sells paid 'Featured Listing & Refunds'.
- **red_flags**: SEO-heavy: dozens of generated 'X-vs-ponytail' compare pages and a sports-betting category. Paid placement.
- **reach_estimate**: Unknown; about 6.3k URLs in its sitemap.
- **sources**: https://skillsllm.com/submit · https://skillsllm.com/about · https://skillsllm.com/skill/ponytail

**Skipped:**
- [agentskills.io](https://agentskills.io): Spec and docs only. It has a Client Showcase of agent products but no skill directory or listing (llms.txt lists only the overview, spec, clients and authoring guides). The spec allows these frontmatter fields: name, description, license, compatibility, metadata, allowed-tools. `argument-hint` is NOT allowed: skills-ref/validator.py ALLOWED_FIELDS rejects extra keys with 'Unexpected fields in frontmatter'.
- [skills.directory](https://skills.directory): Homepage returns an empty shell with no title and a sitemap with one URL. Not a working directory.
- [SkillsDB](https://skillsdb.com): An HR skills-management product unrelated to agent skills (skillsdb.ai redirects there).
- [playbooks.com/skills](https://playbooks.com/skills): Returns 404.
- [agentskills.so](https://agentskills.so): Connection failed (HTTP 000); site looks dead.
- [agent-skills.cc](https://agent-skills.cc): A curated 1,000-of-63k subset with no submit page (/submit 404). Neither caveman nor ponytail is in its 12k-URL sitemap. Low value.
- [ClaudeSkills (claudeskills.org)](https://www.claudeskills.org): Small curated library (417 sitemap URLs) with neither comparable repo listed. Has a submit page, but the legitimacy signal is weak.
- [Agent Skills CLI (agentskills.in)](https://www.agentskills.in): An auto-indexed CLI marketplace that already lists some Kadajett skills, but not the official caveman or ponytail repos (only third-party copies). Weak signal; nothing to do.
- [usmanskillsmd/skillsmp, yan-labs/skillsmp (GitHub)](https://github.com/usmanskillsmd/skillsmp): 0–8 star repos copying the SkillsMP name. Not the real SkillsMP.

### Claude Code plugin directories

#### Anthropic plugin directory (claude.ai/directory), published to Claude Code as the `claude-community` marketplace
- **url**: https://claude.ai/directory/manage
- **type**: plugin-marketplace
- **how_listed**: Web form: the claude.ai developer portal, which reads the plugin from the GitHub repo. PRs are not accepted. The community repo is a read-only mirror whose README says: "Pull requests opened directly against this repo are closed automatically".
- **requirements**: From claude.com/docs/directory/publish, /docs/plugins/submit and /docs/plugins/pre-submission-checklist: (1) a paid claude.ai plan (Pro, Max, Team or Enterprise; Free cannot submit). (2) The GitHub account connected to claude.ai must have push access to Kadajett/cockney. The repo must be public before the listing goes live. (3) `.claude-plugin/plugin.json` must be in the submitted folder, which is the repo root here, so the whole repo is the plugin folder. (4) A README of at least 40 words in the plugin folder (cockney's is about 1,709). (5) A LICENSE file or `license` in plugin.json. (6) The name must be lowercase kebab-case, distinctive, not a brand and not taken. `cockney` is fine. (7) Missing `description`, `author` or `version` gives a warning. (8) Every non-image, non-font file must be 256 KiB or smaller and binaries other than images and fonts are not allowed; otherwise the version is held for a reviewer. Cockney has eval/results/*/records.jsonl at about 2 MB each and eval/tasks/safety-migration-data/repo/app.db, which is a binary SQLite file. Both will get a 'Files or downloads the validator couldn't inspect' hold. (9) At most 512 files (cockney has 325). (10) Every file in the plugin folder must be under 5 MiB, and the repo must archive to under 50 MiB (about 34 MB unpacked). (11) No `.gitattributes` export-ignore; if present, validation stops. (12) A security scan checks that everything the plugin runs or writes is disclosed in the README. Cockney's hooks inject context on SessionStart and on every UserPromptSubmit, and write ~/.config/cockney/sessions/<id>. hooks/claude-settings.ts, used by install.sh, edits ~/.claude/settings.json. (13) Must follow the Anthropic Software Directory Terms and Policy. Hooks load in Cowork and Claude Code but are ignored in claude.ai chat, so chat users get only the skill. Self-promotion: authors submit their own plugins; that is the intended route. Max 10 submissions per org per 24 hours. Every new listing gets human review.
- **exact_action**: Before submitting: from the repo root, run `claude plugin validate --strict .` (it already passes on the current manifests and on the proposed ones with Claude Code 2.1.286). Then: open https://claude.ai/directory/manage → Submit new → choose 'Plugin bundle'. On the Source step, set Repository = `Kadajett/cockney`, leave Plugin path empty (the plugin is at the repo root) and set Branch or tag = `master` or leave it empty for the default branch. Click Validate, fix any 'Blocking' findings, push and re-validate. Then go through Listing details (taken from plugin.json and the README) and Data handling (the plugin reads or stores no personal data and sends nothing off the machine; it stores a per-session mode string locally). On Compliance, enter a contact email and tick all four acknowledgements. On Review and submit, keep 'GitHub push webhook' and click Submit for review. Once live, Claude Code users install with `/plugin marketplace add anthropics/claude-plugins-community` then `/plugin install cockney@claude-community`, or get it through claude.ai account sync. Bump plugin.json `version` on every release.
- **caveman_listed**: yes. In claude-community: https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json#L3101 (source url JuliusBrussee/caveman.git, pinned sha 309834233183…). It is not in claude-plugins-official, and https://claude.com/marketplace/plugins/caveman returns 404.
- **ponytail_listed**: yes. In claude-community: https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json#L23411 (category development, pinned sha 2ed6c52c…). It is not in claude-plugins-official, and the claude.com/marketplace page returns 404.
- **legitimacy**: Run by Anthropic (official). anthropics/claude-plugins-community: 4,628 stars, created 2026-03-20, pushed 2026-10-11, 2,284 plugins, synced nightly from Anthropic's internal review pipeline. code.claude.com/docs/en/plugins/anthropic-marketplaces documents it as the 'Community' marketplace (`claude-community`).
- **red_flags**: Needs a paid claude.ai plan. The first organization to submit a repo folder owns the listing, so submit from the account that should own it. The eval data and app.db will cause reviewer holds unless eval/ is moved out of the repo or plugin folder. Do not use .gitattributes export-ignore to hide it, because that stops validation. The official repo README still links clau.de/plugin-directory-submission, which now 302-redirects to claude.com/docs/directory/publish. The old Console form is dead.
- **reach_estimate**: Highest-trust venue. The community marketplace has 4.6k repo stars and 2,284 plugins. The directory shows in claude.ai/Cowork 'Discover' for paid plans and in Claude Code's `/plugin directory` (v2.1.287+), with account sync to Claude Code.
- **sources**: https://code.claude.com/docs/en/plugins/publish.md · https://claude.com/docs/plugins/submit · https://claude.com/docs/plugins/pre-submission-checklist · https://claude.com/docs/directory/publish · https://claude.com/docs/plugins/platform-support · https://code.claude.com/docs/en/plugins/anthropic-marketplaces.md · https://raw.githubusercontent.com/anthropics/claude-plugins-community/main/README.md · https://raw.githubusercontent.com/anthropics/claude-plugins-community/main/.claude-plugin/marketplace.json · https://api.github.com/repos/anthropics/claude-plugins-community

#### claude-plugins.dev (Claude Plugins registry and CLI)
- **url**: https://claude-plugins.dev/
- **type**: cli-installer
- **how_listed**: Indexed automatically from GitHub. The registry (Val Town 'kamalnrf/claude-plugins-registry') 'Indexes GitHub every 1 hour'. Plugins are found from `marketplace.json` files in `.claude-plugin/` directories, and skills from `SKILL.md` files in `skills/` directories (archived repos excluded).
- **requirements**: A public GitHub repo containing `.claude-plugin/marketplace.json` (cockney has it) and/or `skills/<name>/SKILL.md` (cockney has it). No stars minimum, form or self-promotion policy was found. The indexer pulls metadata such as keywords, homepage, repository and license from the marketplace entry: caveman's entry lacks these and its registry record shows them as null. Adding them to cockney's entry gives a richer listing. [INFERENCE] Discovery likely relies on GitHub code search, which can lag for brand-new, zero-star repos.
- **exact_action**: No submission needed. After indexing, check with `curl 'https://claude-plugins.dev/api/plugins?q=cockney'` (currently 0 hits). Install ids would be `npx claude-plugins install @Kadajett/cockney/cockney` for the plugin and `npx skills-installer install @Kadajett/cockney/cockney` for the skill. The skill page would be https://claude-plugins.dev/skills/@Kadajett/cockney/cockney.
- **caveman_listed**: yes. Plugin record namespace @JuliusBrussee/caveman, found via https://claude-plugins.dev/api/plugins?q=caveman; skill page https://claude-plugins.dev/skills/@JuliusBrussee/caveman/caveman. Plugin detail pages have no stable URL; tried paths return 404.
- **ponytail_listed**: partly. As a skill: https://claude-plugins.dev/skills/@DietrichGebert/ponytail/ponytail. It does not appear as a plugin in the API, even though the repo has .claude-plugin/marketplace.json.
- **legitimacy**: Run by Kamalnrf (Kamal). Kamalnrf/claude-plugins: 563 stars, MIT, created 2025-10-12, pushed 2026-10-05. The README claims 11,989 plugins and 63,065 skills indexed. Open source, with npm packages `claude-plugins` and `skills-installer`. The buildwithclaude indexer source hard-codes it as a 'featured' known marketplace.
- **red_flags**: Asks visitors to join a 'GitHub Token Pool' via OAuth (read-only public). This is not needed to get listed. The CLI writes into ~/.claude/plugins/marketplaces/.
- **reach_estimate**: Medium: 563 repo stars. The API total was 54,401 entries on 2026-10-12. No traffic figures published.
- **sources**: https://raw.githubusercontent.com/Kamalnrf/claude-plugins/main/README.md · https://www.val.town/x/kamalnrf/claude-plugins-registry · https://claude-plugins.dev/api/plugins?q=caveman · https://claude-plugins.dev/skills/@DietrichGebert/ponytail/ponytail

#### ClaudePluginHub
- **url**: https://www.claudepluginhub.com/
- **type**: directory
- **how_listed**: Indexed automatically from GitHub, plus an optional submit form that 'Queue[s] a public GitHub repository for validation'. The form page says: 'GitHub can take days to index new or low-activity repositories; submitting skips that wait.'
- **requirements**: A public GitHub repo with a valid manifest. The about page says it detects `.claude-plugin/plugin.json`. It analyzes component types and safety flags and shows trust signals (stars, maintenance score). No stars minimum or self-promotion rule stated.
- **exact_action**: Go to https://www.claudepluginhub.com/tools/submit-plugin and paste `https://github.com/Kadajett/cockney` in the single field. The expected listing URL is https://www.claudepluginhub.com/plugins/kadajett-cockney, with the marketplace at /marketplaces/kadajett-cockney. This follows the caveman/ponytail slug pattern [INFERENCE].
- **caveman_listed**: https://www.claudepluginhub.com/plugins/juliusbrussee-caveman (also https://www.claudepluginhub.com/marketplaces/juliusbrussee-caveman)
- **ponytail_listed**: https://www.claudepluginhub.com/plugins/dietrichgebert-ponytail (also https://www.claudepluginhub.com/marketplaces/dietrichgebert-ponytail)
- **legitimacy**: Run by an anonymous 'ClaudePluginHub Team'; no public repo found. Not affiliated with Anthropic. The sitemap holds 227,841 URLs. Contact is through a feedback button or email on the site.
- **red_flags**: Anonymous operator and closed source.
- **reach_estimate**: Unknown traffic. Very large index (227k sitemap URLs). Bills itself as 'The Largest Claude Code Plugin Directory' (self-claim).
- **sources**: https://www.claudepluginhub.com/tools/submit-plugin · https://www.claudepluginhub.com/about · https://www.claudepluginhub.com/sitemap.xml

#### Claude Code Marketplaces (claudemarketplaces.com)
- **url**: https://claudemarketplaces.com/
- **type**: aggregator
- **how_listed**: Crawled automatically; there is no form (/submit returns 404). The about page says 'Plugin marketplaces are discovered from GitHub repositories with valid marketplace schemas' and 'Skills are crawled from skills.sh and GitHub with install counts; the indexed catalog keeps the ones with demonstrated search demand'. An editor reviews new and borderline listings.
- **requirements**: A valid `.claude-plugin/marketplace.json` for the marketplaces index. For a search-indexed skill page: skills.sh install counts and search demand. The long tail stays browsable but is not in the sitemap. Delisting sweeps remove spam and off-topic entries.
- **exact_action**: Nothing to submit. Make sure the repo is public with a valid marketplace.json, which is already the case. The skill side is driven by skills.sh [INFERENCE: installs via `npx skills add Kadajett/cockney` feed the counts]; the skills.sh slice is covered by the sibling researcher. Contact: hi@claudemarketplaces.com. The expected skill URL is https://claudemarketplaces.com/skills/kadajett/cockney/cockney [INFERENCE from the pattern].
- **caveman_listed**: https://claudemarketplaces.com/skills/juliusbrussee/caveman/caveman (ranked #1 'Top skills' in llms.txt). Not in the marketplaces/plugins index: /plugins/juliusbrussee-caveman returns 404.
- **ponytail_listed**: https://claudemarketplaces.com/skills/DietrichGebert/ponytail/ponytail (returns 200). Not in the marketplaces/plugins index: /plugins/dietrichgebert-ponytail returns 404.
- **legitimacy**: Run by Mert Duzgun (mertbuilds.com, github.com/mertbuilds). Independent and ad-funded; says it is 'not officially affiliated with Anthropic'. Claims 23,687 skills, 12,870 MCP servers and 2,736 marketplaces indexed. No public repo found (mertbuilds/claudemarketplaces.com returns 404).
- **red_flags**: Ad-heavy (8 sponsor slots). Traffic figures are self-reported.
- **reach_estimate**: Self-reported '380,000+ monthly visitors' and '~380,000 unique monthly visitors (100% organic, public analytics)'.
- **sources**: https://claudemarketplaces.com/about · https://claudemarketplaces.com/llms.txt · https://claudemarketplaces.com/sitemap.xml

#### Build with Claude (buildwithclaude.com), formerly davepoon/claude-code-subagents-collection
- **url**: https://buildwithclaude.com/
- **type**: plugin-marketplace
- **how_listed**: Two routes. (a) A daily cron indexes marketplaces automatically using GitHub code search `filename:marketplace.json path:.claude-plugin` plus repo-topic searches (claude-code-skill, claude-code-skills, claude-skill, agent-skill, agent-skills, anthropic-skill, claude-agent-skill, claude-code-plugins); forks are skipped. (b) A PR adding a plugin entry to the repo's `.claude-plugin/marketplace.json`, which makes cockney installable from the buildwithclaude marketplace and gives it a /plugin page.
- **requirements**: For PRs (CONTRIBUTING.md): branch named `add-<component-name>`, title 'Add [name] [type]', and a PR body with Summary, Component Details (Name/Type/Category), a Testing checklist (`npm test`) and Examples. Automated validation runs, then manual review for uniqueness and quality, then auto-deploy. A rule-based content scanner flags patterns such as `curl … | sh` and `rm -rf $VAR`. No stars minimum. Third-party author PRs merge regularly, e.g. #428 'Add harness-scope plugin' on 2026-10-12, with 0 open PRs.
- **exact_action**: Optional PR to https://github.com/davepoon/buildwithclaude on branch `add-cockney`, titled 'Add cockney plugin'. Append this object to the `plugins` array at the end of `.claude-plugin/marketplace.json`, in the same format as merged PR #428: {"name":"cockney","description":"Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.","version":"0.1.0","author":{"name":"Jeremy Stover","url":"https://github.com/Kadajett"},"homepage":"https://github.com/Kadajett/cockney","repository":"https://github.com/Kadajett/cockney","license":"MIT","keywords":["cockney","terse","minimal","code-style","persona","claude-code"],"category":"productivity","source":{"source":"github","repo":"Kadajett/cockney","sha":"<40-char commit sha of the release>"}}. For auto-indexing alone, do nothing; adding the GitHub topics listed in repo_changes helps discovery.
- **caveman_listed**: yes, as an auto-indexed marketplace (slug @JuliusBrussee/caveman): https://buildwithclaude.com/marketplaces?q=Caveman
- **ponytail_listed**: yes, as an auto-indexed marketplace (slug @DietrichGebert/ponytail): https://buildwithclaude.com/marketplaces?q=Ponytail
- **legitimacy**: Run by Dave Poon (davepoon). davepoon/buildwithclaude: 3,620 stars, created 2025-07-25, pushed 2026-10-12, very active. Open-source Next.js app.
- **red_flags**: An entry pinned to a sha must be updated by PR for each release. The www. host returns 'Application not found' JSON on API paths; use the apex domain buildwithclaude.com.
- **reach_estimate**: Medium: 3.6k stars and an active PR flow. No traffic figures found.
- **sources**: https://github.com/davepoon/buildwithclaude/blob/main/CONTRIBUTING.md · https://github.com/davepoon/buildwithclaude/blob/main/web-ui/lib/indexer/marketplace-indexer.ts · https://github.com/davepoon/buildwithclaude/pull/428 · https://buildwithclaude.com/api/search?q=caveman · https://api.github.com/repos/davepoon/buildwithclaude

#### Claude Code Templates (aitmpl.com)
- **url**: https://aitmpl.com/
- **type**: cli-installer
- **how_listed**: PR that adds a vendored copy of the SKILL.md to davila7/claude-code-templates.
- **requirements**: File at `cli-tool/components/skills/<category>/<skill-name>/SKILL.md`. Contributions are licensed MIT (CONTRIBUTING: 'By contributing… licensed under the MIT License'). Third-party skill PRs get merged; e.g. #880 'Add eval-genius skill' added only `cli-tool/components/skills/development/eval-genius/SKILL.md`, with the body citing the upstream source and license. Only the skill is copied: cockney's hooks (SessionStart/UserPromptSubmit) and mode switching would not ship.
- **exact_action**: PR to https://github.com/davila7/claude-code-templates that adds `cli-tool/components/skills/development/cockney/SKILL.md` (a copy of skills/cockney/SKILL.md). PR body like #880: 'Adds the cockney skill (source: https://github.com/Kadajett/cockney, MIT) - terse replies, smallest correct change, plain-English warnings for risky changes.' The resulting install command would be `npx claude-code-templates@latest --skill development/cockney --yes`.
- **caveman_listed**: no (not in the repo tree, which has 12,232 paths)
- **ponytail_listed**: no
- **legitimacy**: Run by davila7 (Daniel Avila). davila7/claude-code-templates: 32,572 stars, created 2025-07-04, pushed 2026-10-12. Most merges are by the maintainer, but outside contributors do get merged.
- **red_flags**: The vendored copy drifts from upstream and loses the hooks, so it is a degraded experience. The cubic AI bot auto-summarizes PRs.
- **reach_estimate**: High repo visibility: 32.6k stars.
- **sources**: https://github.com/davila7/claude-code-templates/blob/main/CONTRIBUTING.md · https://github.com/davila7/claude-code-templates/pull/880 · https://api.github.com/repos/davila7/claude-code-templates

#### Awesome Claude Code Plugins (ccplugins) and claudecodeplugins.dev
- **url**: https://github.com/ccplugins/awesome-claude-code-plugins
- **type**: awesome-list
- **how_listed**: PR to the README, and/or to `.claude-plugin/marketplace.json`; the site's 'Submit Plugin' button links to editing that file on GitHub. claudecodeplugins.dev is generated from this repo's marketplace.json.
- **requirements**: README: 'Contributions are welcome! You can add your favorite plugins, share best practices, or submit your own marketplace.' Self-submission is explicitly allowed. No stars minimum. Marketplace entries in the file use categories such as 'Development Engineering', 'Workflow Orchestration' and 'Code Quality Testing'.
- **exact_action**: PR to ccplugins/awesome-claude-code-plugins. (1) In README.md under `### Development Engineering`, or under `### Workflow Orchestration` where the token-saving 'espresso' entry sits, add the line: `- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky.` (2) Optionally append to `.claude-plugin/marketplace.json` `plugins`, following the existing external entry 'trigger-tree': {"name":"cockney","displayName":"Cockney","source":{"source":"github","repo":"Kadajett/cockney"},"description":"Cheeky Cockney coding mode: terse replies, the smallest correct change, plain English for anything risky.","version":"0.1.0","author":{"name":"Jeremy Stover","url":"https://github.com/Kadajett"},"category":"Development Engineering","homepage":"https://github.com/Kadajett/cockney","repository":"https://github.com/Kadajett/cockney","license":"MIT","keywords":["cockney","terse","minimal","code-style","persona"],"tags":["productivity","code-style"]}
- **caveman_listed**: no. It is mentioned only inside another entry ('espresso … RTK, Caveman …').
- **ponytail_listed**: no
- **legitimacy**: ccplugins org. 970 stars, created 2025-10-13, last push 2026-08-12. Site homepage claudecodeplugins.dev; marketplace owner email support@claudecodeplugins.dev.
- **red_flags**: Stale. The last merges were a batch on 2026-08-12 ('Resolve plugin contribution backlog') and 200+ PRs are open, so a PR may sit unmerged.
- **reach_estimate**: Low to medium: 970 stars.
- **sources**: https://github.com/ccplugins/awesome-claude-code-plugins · https://raw.githubusercontent.com/ccplugins/awesome-claude-code-plugins/main/.claude-plugin/marketplace.json · https://claudecodeplugins.dev/

#### Awesome Claude Plugins (composio-community)
- **url**: https://github.com/composio-community/awesome-claude-plugins
- **type**: awesome-list
- **how_listed**: PR to README.md.
- **requirements**: CONTRIBUTING section: 'Want to add your plugin?' Fork, then 'Add your plugin folder with the standard structure', 'Update this README', and submit a PR. In practice, external entries are a README link only. The plugin must: 'Addresses a real use case', 'Doesn't duplicate existing functionality', 'Follows the template structure', 'Has been tested'. Self-submission is explicitly invited.
- **exact_action**: PR adding under `### Companion & Personality` (the closest fit; its existing entry is claude-familiar): `- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding persona for Claude Code: terse replies, the smallest correct change, and plain-English warnings for anything risky. Skill plus SessionStart/UserPromptSubmit hooks with /cockney lite|full|off levels.` `### Developer Productivity` is the alternative.
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: composio-community org (Composio). 1,939 stars, created 2025-10-22, last push 2026-07-26.
- **red_flags**: Backlog: 300 open PRs, last merge 2026-07-26. The README leads with Composio product promotion.
- **reach_estimate**: Medium: 1.9k stars.
- **sources**: https://github.com/composio-community/awesome-claude-plugins · https://api.github.com/repos/composio-community/awesome-claude-plugins

#### Tons of Skills (tonsofskills.com; claudecodeplugins.io redirects here)
- **url**: https://tonsofskills.com/
- **type**: plugin-marketplace
- **how_listed**: Issue form, then a PR mirrored via `sources.yaml`, synced weekly every Monday 06:00 UTC by .github/workflows/sync-external.yml.
- **requirements**: Issue template plugin-submission.yml asks for: Plugin Name, GitHub Repo URL, What does it do, Problem, Who is it for, Success criteria, Functional requirements, Submission tier and Category. Checklist: plugin.json + .claude-plugin/marketplace.json; every SKILL.md has 8 frontmatter fields (`name`, `description`, `allowed-tools`, `version`, `author`, `license`, `compatibility`, `tags`) and 7 body sections (`## Overview`, `## Prerequisites`, `## Instructions`, `## Output`, `## Error Handling`, `## Examples`, `## Resources`); README.md and LICENSE; passes `python3 scripts/validate-skills-schema.py --marketplace`. Scored on a 100-point rubric. Sources failing the validator are removed. Cockney's SKILL.md does not meet this spec today.
- **exact_action**: https://github.com/jeremylongshore/tons-of-skills-marketplace/issues/new?template=plugin-submission.yml with Plugin Name `cockney`, GitHub Repo URL `https://github.com/Kadajett/cockney`, tier 'micro-skill (single command/skill, no scripts)' or 'standard plugin', category 'productivity'. Then the sources.yaml entry format: `- name: cockney` / `description: …` / `repo: Kadajett/cockney` / `source_path: .` / `target_path: plugins/productivity/cockney` / `author: {name: Jeremy Stover, github: Kadajett}` / `license: MIT` / `category: productivity` / `include: [...]`. Low priority: it requires restructuring SKILL.md.
- **caveman_listed**: no (not in the repo tree, which has 40,491 paths)
- **ponytail_listed**: no
- **legitimacy**: Run by jeremylongshore. jeremylongshore/tons-of-skills-marketplace (formerly claude-code-plugins-plus-skills): 2,831 stars, created 2025-10-10, pushed 2026-10-12.
- **red_flags**: Heavy bespoke spec. It mirrors and can 'curate' (freeze and locally modify) third-party plugins. The ccpi package manager is in the mix.
- **reach_estimate**: Medium: 2.8k stars.
- **sources**: https://github.com/jeremylongshore/tons-of-skills-marketplace/blob/main/.github/ISSUE_TEMPLATE/plugin-submission.yml · https://github.com/jeremylongshore/tons-of-skills-marketplace/blob/main/sources.yaml · https://tonsofskills.com/

**Skipped:**
- [anthropics/claude-plugins-official (`claude-plugins-official`)](https://github.com/anthropics/claude-plugins-official): Not open to submissions. Docs: "Anthropic's official marketplace, claude-plugins-official, doesn't take submissions through the directory portal. If you work with an Anthropic partner contact, ask them about an official-marketplace listing." Partner-only: 315 entries, and caveman and ponytail are not in it. Use the directory portal, which feeds claude-community. 37,707 stars, created 2025-11-20.
- [davepoon/claude-code-subagents-collection](https://github.com/davepoon/claude-code-subagents-collection): Renamed to davepoon/buildwithclaude (the API resolves to the same repo). Covered above.
- [claude-market/marketplace](https://github.com/claude-market/marketplace): Dormant: 26 stars, last push 2025-11-04.
- [claudecodecommands.directory (ananddtyagi/claude-code-marketplace)](https://claudecodecommands.directory/): Commands-focused per the buildwithclaude indexer's KNOWN_MARKETPLACES description. Submission process not researched [UNVERIFIED]. Low fit for a skill/persona plugin.
- [claude.com/marketplace web pages](https://claude.com/marketplace/plugins): Not a separate venue. Docs: 'there's no separate Claude Marketplace submission, and you submit to the directory instead'. It showed 342 plugins, and claude-community entries (e.g. caveman) have no page there (404).

### Codex, Gemini, ClawHub, Copilot, Cursor

#### ClawHub (OpenClaw skill registry)
- **url**: https://clawhub.ai
- **type**: registry
- **how_listed**: CLI publish. A web GitHub importer also exists, but it only imports public, non-fork repos owned by the signed-in GitHub account.
- **requirements**: Publish a skill folder containing SKILL.md (skills/cockney/ is fine). Frontmatter `name` should match the folder and use 1–64 lowercase letters, numbers or hyphens. `description` becomes the UI and search summary. `version` is optional because the CLI defaults to 1.0.0 and auto-bumps the patch. `metadata.openclaw.{requires,envVars,homepage,emoji}` is optional; cockney has no env or bins. Accounts sign in with GitHub through a device flow (`clawhub login`). Immersive Labs reports that publishing needs a GitHub account at least 1 week old; I did not find that rule in the current docs. LICENSE: every skill on ClawHub is relicensed MIT-0 (no attribution required), and the docs say not to put conflicting license terms in SKILL.md, which conflicts with cockney's `license: MIT` frontmatter. Moderation: every release goes through ClawScan, VirusTotal, NVIDIA SkillSpector, static analysis and Tencent A.I.G. The scanners check that declared metadata matches actual behaviour. New releases can be held out of install surfaces until review finishes. The acceptable-usage policy flags pipe-to-shell installers, undeclared secrets, fake engagement and misleading affiliation. Users can report listings, and the platform runs a daily abuse-signal scan that can lead to auto-bans. Limits: at most 3 categories from a fixed list, at most 5 topics, and reserved topics (official, verified, featured, curated, …) are rejected.
- **exact_action**: From the repo root: `clawhub login` (or `npx clawhub@latest login`), then `clawhub skill publish ./skills/cockney --slug cockney --name "Cockney" --version 0.1.0 --categories development,agents --topics "terse,minimal-code,code-review,persona" --dry-run`, then run the same command without `--dry-run`. Then `clawhub inspect @<handle>/cockney` to check moderation and scan status. For ongoing releases you can use the reusable workflow: `uses: openclaw/clawhub/.github/workflows/skill-publish.yml@main` with `owner: <handle>` and secret `clawhub_token`.
- **caveman_listed**: Only as third-party re-uploads, not by JuliusBrussee: https://clawhub.ai/skaravind/skills/caveman (5,422 downloads, no source link) and https://clawhub.ai/seanford/skills/caveman (448 downloads).
- **ponytail_listed**: https://clawhub.ai/dietrichgebert/skills/ponytail (author-owned, featured:true, 4,313 downloads). There is also a third-party copy at /paudyyin/skills/ponytail.
- **legitimacy**: Run by the openclaw org: https://github.com/openclaw/clawhub has 9,500★, was created 2026-01-03 and last pushed 2026-10-12. The parent openclaw/openclaw has 391,724★. Security research is published at openclaw.ai/publications.
- **red_flags**: ClawHavoc (Feb 2026): Koi Security found 341 malicious skills, mostly AMOS infostealer delivered through fake prerequisites (The Hacker News, Koi blog). Trend Micro reported AMOS distribution through OpenClaw skills. TechTarget covered it as systemic marketplace risk. The marketplace is open-by-default, and re-uploads under other handles are common: two copies of caveman, one of ponytail. That makes 'cockney' squattable, so publishing first under the author's own handle claims it. Publishing forces the MIT-0 relicense. Only the skill folder is published, so the always-on hooks (cockney's main value) do not ship.
- **reach_estimate**: Large. OpenClaw has 391k★, Immersive Labs counted 20k+ skills, and the registry API showed ponytail at 4.3k downloads and the top caveman copy at 5.4k. A search for 'cockney' currently returns nothing.
- **sources**: https://raw.githubusercontent.com/openclaw/clawhub/main/docs/cli.md · https://raw.githubusercontent.com/openclaw/clawhub/main/docs/publishing.md · https://raw.githubusercontent.com/openclaw/clawhub/main/docs/skill-format.md · https://github.com/openclaw/clawhub/blob/main/docs/moderation.md · https://github.com/openclaw/clawhub/blob/main/docs/acceptable-usage.md · https://github.com/openclaw/clawhub/blob/main/docs/security-audits.md · https://clawhub.ai/api/v1/search?q=caveman · https://clawhub.ai/api/v1/search?q=ponytail · https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting · https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html · https://www.trendmicro.com/en/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html · https://www.immersivelabs.com/resources/c7-blog/openclaw-hunting-season-is-open

#### Gemini CLI extension gallery
- **url**: https://geminicli.com/extensions
- **type**: aggregator
- **how_listed**: Auto-indexed from GitHub. No submission is needed: a crawler finds public repos tagged with the `gemini-cli-extension` topic every day and lists them if they pass validation.
- **requirements**: Public GitHub repo, the `gemini-cli-extension` topic, and `gemini-extension.json` at the repo root (or the release-archive root). Minimal manifest is `{name, version, description}`. An optional `contextFileName` points to an always-loaded context file; if it is omitted, a GEMINI.md in the root is loaded. Gemini extensions support Agent Skills natively: `skills/<name>/SKILL.md` inside the extension is exposed as a skill, so skills/cockney is picked up with no extra config. HAZARD: Gemini also auto-loads `hooks/hooks.json` from the extension directory and uses its own schema. Its timeout is in milliseconds, so cockney's `"timeout": 10` would mean 10 ms. Its variables are `${extensionPath}`, and CLAUDE_PLUGIN_ROOT is not set (only CLAUDE_PROJECT_DIR is aliased). Its prompt event is BeforeAgent, not UserPromptSubmit. So cockney's Claude hooks file would load and break under Gemini. Caveman and ponytail both avoid this: caveman ships only GEMINI.md, and ponytail names its Claude hooks file `hooks/claude-codex-hooks.json`.
- **exact_action**: 1) Add root `gemini-extension.json` (see repo_changes). 2) Rename hooks/hooks.json (see repo_changes). 3) Run `gh repo edit Kadajett/cockney --add-topic gemini-cli-extension`. 4) Wait for the daily crawl. Users install with `gemini extensions install https://github.com/Kadajett/cockney`, or the skill alone with `gemini skills install https://github.com/Kadajett/cockney.git --path skills/cockney`.
- **caveman_listed**: Yes. The gallery page data includes data-full-name="JuliusBrussee/caveman" (https://geminicli.com/extensions). Its manifest uses contextFileName GEMINI.md.
- **ponytail_listed**: Yes. The gallery data includes data-full-name="DietrichGebert/ponytail" (https://geminicli.com/extensions). Its manifest uses contextFileName AGENTS.md. Note that neither repo currently has the gemini-cli-extension topic, so they were presumably indexed earlier.
- **legitimacy**: Official Google gallery. google-gemini/gemini-cli has 107,294★, was created 2025-04-17 and last pushed 2026-10-12. The listing rules are in the official docs.
- **red_flags**: Reach is shrinking. Google's May 19, 2026 announcement says Gemini CLI stopped serving consumer, free and AI Pro/Ultra users on June 18, 2026. It survives for Code Assist Standard/Enterprise and paid API-key users, and consumers move to Antigravity CLI. Antigravity imports existing Gemini extensions with `agy plugin import gemini`. Antigravity also has a curated Marketplace, but I found no public submission path for it [UNVERIFIED]. The hooks.json schema clash described above must be fixed first.
- **reach_estimate**: Medium and falling: 107k★ upstream but the consumer sunset has happened. The gallery is a large single page with many derivative caveman and ponytail forks listed, which suggests low curation.
- **sources**: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/extensions/releasing.md · https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/extensions/reference.md · https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/skills.md · https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/hooks/index.md · https://geminicli.com/extensions · https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli · https://antigravity.google/docs/cli/gcli-migration · https://antigravity.google/docs/marketplace

#### Piebald-AI/awesome-gemini-cli
- **url**: https://github.com/Piebald-AI/awesome-gemini-cli
- **type**: awesome-list
- **how_listed**: PR that edits README.md
- **requirements**: The entry must relate to Gemini CLI and be added at the bottom of the appropriate section. CONTRIBUTING gives the format `- [Project Name](URL) - Description`. No star minimum and no self-promotion ban; recent merges are mostly self-submissions.
- **exact_action**: Append to the bottom of `## Commands & Extensions` in README.md:
`- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, and plain-English warnings for anything risky. Install via \`gemini extensions install https://github.com/Kadajett/cockney\`.`
`## Fun` is the alternative section (it holds personality tools).
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: Run by Piebald-AI: 512★, created 2025-07-30, last pushed 2026-10-11. It is active, with merges on 2026-10-10 and 2026-10-11.
- **red_flags**: The README embeds promotion for Piebald (the maintainer's own product). The list is small.
- **reach_estimate**: Low (512★)
- **sources**: https://raw.githubusercontent.com/Piebald-AI/awesome-gemini-cli/main/README.md · https://raw.githubusercontent.com/Piebald-AI/awesome-gemini-cli/main/CONTRIBUTING.md

#### Piebald-AI/awesome-gemini-cli-extensions
- **url**: https://github.com/Piebald-AI/awesome-gemini-cli-extensions
- **type**: awesome-list
- **how_listed**: PR that edits README.md
- **requirements**: Must be a Gemini CLI extension, so it needs gemini-extension.json first. Add it at the bottom of the appropriate section. CONTRIBUTING specifies `- [**Project Name**](URL) - Description`, but the existing entries are not bold.
- **exact_action**: Append to the bottom of `## Utilities` (where the similar `tldr` and `unslop` persona/output tools sit):
`- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, and plain-English warnings for anything risky. Install: \`gemini extensions install https://github.com/Kadajett/cockney\`.`
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: Run by Piebald-AI: 69★, created 2025-09-11, last pushed 2026-10-11.
- **red_flags**: Very small.
- **reach_estimate**: Very low (69★)
- **sources**: https://raw.githubusercontent.com/Piebald-AI/awesome-gemini-cli-extensions/main/README.md · https://raw.githubusercontent.com/Piebald-AI/awesome-gemini-cli-extensions/main/CONTRIBUTING.md

#### Codex self-hosted plugin marketplace (codex plugin marketplace add)
- **url**: https://developers.openai.com/codex/plugins/build
- **type**: cli-installer
- **how_listed**: Self-distribution: users add the repo as a marketplace source. Nothing is listed centrally.
- **requirements**: Codex and the ChatGPT desktop app read `.agents/plugins/marketplace.json`, and also the legacy-compatible `$REPO_ROOT/.claude-plugin/marketplace.json` that cockney already has. OpenAI also accepts Claude-compatible plugin manifests. Every marketplace entry should carry `policy.installation`, `policy.authentication` and `category`. Codex auto-discovers `hooks/hooks.json` unless the manifest sets `hooks`. It sets CLAUDE_PLUGIN_ROOT for compatibility, but plugin hooks are skipped until the user reviews and trusts them.
- **exact_action**: Users run `codex plugin marketplace add Kadajett/cockney` and then install cockney from the Plugins Directory or `/plugins`. Skill-only install: `$skill-installer install https://github.com/Kadajett/cockney/tree/main/skills/cockney`, or `python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Kadajett/cockney --path skills/cockney --name cockney`. Recommended: add `.agents/plugins/marketplace.json` and `.codex-plugin/plugin.json` (see repo_changes; this is what ponytail does).
- **caveman_listed**: N/A, nothing is listed centrally. Caveman ships `.codex/hooks.json`.
- **ponytail_listed**: N/A. Ponytail ships `.agents/plugins/marketplace.json` plus `.codex-plugin/plugin.json`.
- **legitimacy**: Official OpenAI docs.
- **red_flags**: I did not test whether the legacy `.claude-plugin/marketplace.json` (no policy or category) resolves through `codex plugin marketplace add` in the CLI; the docs state it for the ChatGPT desktop app [INFERENCE].
- **reach_estimate**: Install path only; it does not help discovery.
- **sources**: https://developers.openai.com/codex/plugins/build · https://raw.githubusercontent.com/openai/skills/main/skills/.system/skill-installer/SKILL.md · https://github.com/DietrichGebert/ponytail/blob/main/.agents/plugins/marketplace.json

#### OpenAI universal Plugin Directory (ChatGPT + Codex)
- **url**: https://platform.openai.com/plugins
- **type**: plugin-marketplace
- **how_listed**: Web form. Upload a ZIP at platform.openai.com/plugins, clear the automated checks, submit for human review, then publish.
- **requirements**: You need an OpenAI platform org with individual or business verification; the org owner or a member with Apps Management Write submits. The ZIP needs a portable root `plugin.json` (`$schema` https://agent-plugins.org/schemas/1.0.0/plugin.schema.json, plus name, version) or `.codex-plugin/plugin.json`. The Codex format requires name, version, description, author.name, skills, and an `interface` with displayName (≤30 chars), shortDescription (≤30), longDescription, developerName, category, capabilities, composerIcon and logo (square, ≥48px; assets/logo.png is 1254×1254, so it qualifies). Skills-only plugins need none of the MCP review items (test cases, video, privacy/ToS URLs). HARD BLOCKER: ZIPs with lifecycle hooks or app references cannot be submitted, so the ZIP must be skills-only without hooks/. Required skill scans must pass.
- **exact_action**: Build a skills-only ZIP (plugin.json or .codex-plugin/plugin.json + skills/cockney/SKILL.md + assets/logo.png, no hooks/). Go to https://platform.openai.com/plugins → Upload new or existing plugin → choose the verified Developer identity → Upload plugin → resolve Metadata & Skills findings → Submit for review (policy attestations) → Publish plugin once approved.
- **caveman_listed**: unknown. It is not in openai/plugins' curated marketplace.json, and I found no public directory search API.
- **ponytail_listed**: unknown. Same as caveman. Ponytail's Codex manifest includes lifecycle hooks, which makes it ineligible as-is.
- **legitimacy**: Official OpenAI channel.
- **red_flags**: Identity verification and human review are slow and gated. Without hooks, cockney loses its always-on behaviour; its own README cites JetBrains finding that a bare SKILL.md self-activated 0/10 times. Rejection is possible under 'meaningful uplift'-style guidelines [UNVERIFIED].
- **reach_estimate**: Highest potential: the directory is shared across ChatGPT and Codex.
- **sources**: https://developers.openai.com/plugins/deploy/submission.md · https://developers.openai.com/codex/plugins/build

#### ComposioHQ / composio-community awesome-codex-skills
- **url**: https://github.com/composio-community/awesome-codex-skills
- **type**: awesome-list
- **how_listed**: PR that edits README.md (external-repo entry; no need to copy files in)
- **requirements**: 'PRs welcome. Add real, reusable skills, keep descriptions precise.' The description must state clearly when Codex should trigger. No star minimum. External entries are linked with an install command.
- **exact_action**: Add under `### Development & Code Tools` in README.md, copying the existing external-entry format:
`- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, and plain-English warnings for anything risky; lite/full/guvnor levels. Install: \`python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Kadajett/cockney --path skills/cockney --name cockney\``
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: Run by Composio (the repo was transferred from ComposioHQ to composio-community): 16,868★, created 2026-01-12, last pushed 2026-07-26.
- **red_flags**: Merges have slowed: the last one was 2026-07-26 and 30 PRs are open. The README is vendor-promotional (Composio MCP gateway).
- **reach_estimate**: High stars (16.9k) but stale maintenance.
- **sources**: https://github.com/composio-community/awesome-codex-skills/blob/master/README.md

#### hashgraph-online/awesome-codex-plugins
- **url**: https://github.com/hashgraph-online/awesome-codex-plugins
- **type**: awesome-list
- **how_listed**: PR adding one README.md line. A CI generator then mirrors the plugin bundle into the repo's `.agents/plugins/marketplace.json`, so it also works as a Codex marketplace.
- **requirements**: The plugin repo must contain `.codex-plugin/plugin.json`. It must pass HOL AI Plugin Scanner with a centralized score of at least 80/130 (`pipx run plugin-scanner scan . --format text`; lint and verify too). Entries are alphabetical within a category, the description is one sentence, and the link points to the repo root.
- **exact_action**: After adding .codex-plugin/plugin.json, add in alphabetical order under `### Development & Workflow`:
`- [Cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode with terse replies, the smallest correct change, and plain-English warnings for anything risky.`
Include the scanner score in the PR.
- **caveman_listed**: no. It is only mentioned inside the 'Espresso' entry.
- **ponytail_listed**: no
- **legitimacy**: Run by Hashgraph Online (HOL): 1,284★, created 2026-03-28, last pushed 2026-10-11.
- **red_flags**: Vendor-run: it pushes the maintainer's own scanner and 'HOL Guard' product and self-describes as 'The #1 Codex Marketplace'. The vendor scanner gate is mandatory.
- **reach_estimate**: Low–medium (1.3k★)
- **sources**: https://raw.githubusercontent.com/hashgraph-online/awesome-codex-plugins/main/README.md · https://raw.githubusercontent.com/hashgraph-online/awesome-codex-plugins/main/CONTRIBUTING.md

#### github/awesome-copilot (external plugin; built-in Copilot CLI marketplace)
- **url**: https://github.com/github/awesome-copilot
- **type**: plugin-marketplace
- **how_listed**: Issue form (external plugin review workflow). Direct PRs to plugins/external.json are forbidden. An alternative is a PR that copies the skill into `skills/<name>/` as in-repo content.
- **requirements**: External plugin: public GitHub repo, `source.source: github`, an immutable ref (a release tag) plus a full 40-char SHA, a semver version, a license, author.name, and lowercase-hyphenated keywords. Automated gates run `vally lint` and a Copilot CLI install smoke test, then a maintainer `/approve`s, with re-review every 6 months. Copilot legacy manifests are found at `.plugin/plugin.json`, `plugin.json`, `.github/plugin/plugin.json` or `.claude-plugin/plugin.json`, and legacy plugins auto-load `hooks.json` or `hooks/hooks.json`. Copilot's hook schema differs, which is why ponytail ships `hooks/copilot-hooks.json`. Content policy rejects 'Duplicate Existing Model Strengths Without Meaningful Uplift'. In-repo skill path: `npm run skill:create -- --name cockney --description "..."`, `npm run skill:validate`, `npm run build`, with the PR targeting `main` (not `staged`).
- **exact_action**: Tag a release (`git tag v0.1.0 && git push --tags`). Then open https://github.com/github/awesome-copilot/issues/new?template=external-plugin.yml with: Plugin name `cockney`; Short description; GitHub repository `Kadajett/cockney`; Plugin path `/` (blank for root); Ref `v0.1.0`; Commit SHA `<40-char sha of v0.1.0>`; Plugin version `0.1.0`; License `MIT`; Author name `Jeremy Stover`; Author URL `https://github.com/Kadajett`; Homepage `https://github.com/Kadajett/cockney`; then tick the checkboxes. If intake fails, comment `/rerun-intake` after fixing.
- **caveman_listed**: no. It is not among the 71 entries in plugins/external.json. An unrelated community `instructions/caveman-mode.instructions.md` and `agents/caveman-mode.agent.md` are in the repo, which is a duplication risk for a terse-mode submission.
- **ponytail_listed**: no. It is not in external.json, although ponytail ships .github/plugin/marketplace.json for self-hosting.
- **legitimacy**: Run by GitHub (the github org): 39,931★, created 2025-06-11, last pushed 2026-10-12. Copilot CLI ships it as the built-in default marketplace.
- **red_flags**: The 'meaningful uplift' rule and existing caveman-mode content raise the chance of rejection. cockney's Claude-format hooks/hooks.json would be auto-loaded by Copilot's legacy plugin loader, so rename it first. Users can also self-install with `copilot plugin marketplace add Kadajett/cockney` (Copilot reads `.claude-plugin/marketplace.json`).
- **reach_estimate**: Very high: it is the default marketplace in Copilot CLI, and the repo has 40k★.
- **sources**: https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md · https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference

#### Cursor Marketplace (official)
- **url**: https://cursor.com/marketplace
- **type**: plugin-marketplace
- **how_listed**: Web form at https://cursor.com/marketplace/publish (submit the repo link). Every plugin is manually reviewed by the Cursor team.
- **requirements**: A root `plugin.json` (Agent Plugins format: skills and MCP only) or `.cursor-plugin/plugin.json` (Cursor format: also rules, agents, commands and hooks). Name must be unique and kebab-case. Clear description, README.md, logo committed by relative path, all paths relative (no `..`), and tested locally. Cursor parses `hooks/hooks.json` with camelCase events (sessionStart, beforeSubmitPrompt), so cockney's Claude-format file clashes; ponytail ships `hooks/cursor-hooks.json` instead.
- **exact_action**: Add `.cursor-plugin/plugin.json` (`{"name":"cockney","version":"0.1.0","description":"…","logo":"assets/logo.png"}`) and/or a portable root `plugin.json`, rename the hooks file, then submit https://github.com/Kadajett/cockney at https://cursor.com/marketplace/publish.
- **caveman_listed**: unknown. https://cursor.com/marketplace/juliusbrussee/caveman returns 'Plugin Not Found'. Caveman does ship `.cursor-plugin/plugin.json`.
- **ponytail_listed**: unknown. https://cursor.com/marketplace/dietrichgebert/ponytail returns 'Plugin Not Found'. Ponytail ships .cursor rules and hooks.
- **legitimacy**: Official Cursor channel. Launched with Cursor 2.5 with partners such as AWS, Figma, Linear and Stripe.
- **red_flags**: Partner- and curation-heavy, and the review bar is unknown. The 'Not Found' slug check may be using the wrong URL pattern.
- **reach_estimate**: High if accepted, but acceptance is uncertain.
- **sources**: https://cursor.com/docs/reference/plugins.md · https://cursor.com/docs/plugins.md

#### cursor.directory (community)
- **url**: https://cursor.directory/plugins/new
- **type**: directory
- **how_listed**: Web form at https://cursor.directory/plugins/new. Requires signing in with GitHub or Google.
- **requirements**: Sign in. The form fields could not be read without logging in [UNVERIFIED]. Listings cover plugins, rules and MCP servers.
- **exact_action**: Sign in at https://cursor.directory/plugins/new, choose 'Submit a plugin' and give the repo URL https://github.com/Kadajett/cockney.
- **caveman_listed**: no as far as I can tell: /plugins/caveman and /plugins/juliusbrussee-caveman return 404, and search only found the unrelated 'god-of-debugger' (caveman tone).
- **ponytail_listed**: no as far as I can tell: /plugins/ponytail returns 404.
- **legitimacy**: Community site (claims 86.4k+ developers). Ownership not verified [UNVERIFIED].
- **red_flags**: Vercel bot checkpoint blocks scripted access. Low curation.
- **reach_estimate**: Medium [UNVERIFIED]
- **sources**: https://cursor.directory/plugins · https://cursor.directory/plugins/new

#### skills.sh (npx skills, vercel-labs/skills)
- **url**: https://skills.sh
- **type**: aggregator
- **how_listed**: Auto-indexed from install telemetry: every public skill installed through the `skills` CLI is indexed and ranked by anonymous installs.
- **requirements**: A public GitHub repo with a SKILL.md (Agent Skills frontmatter). The page appears after someone installs it.
- **exact_action**: `npx skills add Kadajett/cockney` (one install triggers indexing). The page will then be at https://skills.sh/kadajett/cockney/cockney.
- **caveman_listed**: https://skills.sh/juliusbrussee/caveman/caveman
- **ponytail_listed**: https://skills.sh/dietrichgebert/ponytail/ponytail
- **legitimacy**: Run by Vercel Labs: vercel-labs/skills has 33,867★, created 2026-01-14, last pushed 2026-10-09. npm `skills` 1.7.2 was published 2026-10-09.
- **red_flags**: none notable. It likely overlaps with a sibling agent's slice.
- **reach_estimate**: High
- **sources**: https://skills.sh/about · https://skills.sh/juliusbrussee/caveman/caveman · https://skills.sh/dietrichgebert/ponytail/ponytail

**Skipped:**
- [openai/skills catalog (.curated/.experimental)](https://github.com/openai/skills): The README now says 'This repository is deprecated' and points to openai/plugins and the Build plugins guide. Its contributing.md has no third-party submission process; .curated holds OpenAI and partner skills only (figma, notion, vercel, …).
- [openai/plugins](https://github.com/openai/plugins): An OpenAI-curated example and partner repo. Recent merges are all by OpenAI staff (e.g. 'Add Qodo to curated marketplaces'), and there is no CONTRIBUTING. Third parties use the platform.openai.com/plugins submission instead.
- [add-skill (npm)](https://www.npmjs.com/package/add-skill): Deprecated: the npm description says "DEPRECATED: Use 'npx skills add' instead" (repo vercel-labs/skills).
- [openskills](https://github.com/numman-ali/openskills): It installs from any GitHub repo, so there is no listing or registry to join. Stale since the last push on 2026-01-18. Users can already run `npx openskills install Kadajett/cockney`.
- [SkillKit marketplace](https://github.com/rohitg00/skillkit): Low signal: 1,548★, last pushed 2026-06-02, and neither caveman nor ponytail is in marketplace/skills.json (0 hits). If wanted anyway, `skillkit publish submit` opens .github/ISSUE_TEMPLATE/skill-submission.yml with fields Skill Name, Description, GitHub Owner, Repository Name, Skill Path, Tags, Author GitHub Username, and checklist items.
- [KarelDO/awesome-codex](https://github.com/KarelDO/awesome-codex): Covers the 2021 OpenAI Codex model (products and demos), not Codex CLI skills; 204★.
- [Antigravity Marketplace](https://antigravity.google/docs/marketplace): The docs describe a curated in-app Marketplace with no public submission path documented [UNVERIFIED]. Gemini extensions reach Antigravity users through `agy plugin import gemini`.

### Awesome lists

_Summary:_ Checked 2026-10-11/12 against live GitHub API and raw files. Cockney (Kadajett/cockney): 0 stars, created 2026-10-12, first commit 2026-10-12T01:51:14Z, 18 commits, no topics. Most of the big lists have age or star gates, or say outright that brand-new skills won't be taken. Can do now: karanb192/awesome-claude-skills (merges PRs actively and accepted analogues with 2–11 stars), BehiSecc, alvinreal, abubakarsiddik31, ccplugins and RoggeOhta (via an issue). quemsah indexes it automatically. hesreallyhim opens 2026-10-26T01:51Z (14 days since first commit) or at 100 stars. travisvn needs 10 stars. VoltAgent and JackyST0 need maturity or 64 stars. Caveman is listed in hesreallyhim, jqueryscript, quemsah, alvinreal and ai-boost/awesome-prompts. Ponytail is listed in jqueryscript, quemsah, abubakarsiddik31, ai-boost/awesome-harness-engineering, ai-boost/awesome-prompts and LinklyAI. Neither is in travisvn, ComposioHQ, VoltAgent, BehiSecc, karanb192, heilcheng or the Codex/Gemini lists.

#### karanb192/awesome-claude-skills
- **url**: https://github.com/karanb192/awesome-claude-skills
- **type**: awesome-list
- **how_listed**: PR to README.md (one skill per PR, PR template). Alternative: issue form .github/ISSUE_TEMPLATE/skill-submission.yml
- **requirements**: CONTRIBUTING: 'Working SKILL.md file - Must have valid YAML frontmatter'; 'Active maintenance - commits within the last 6 months'; open source; no malicious code; 'Skill has been tested and works with Claude'; description <=150 chars, active voice, concrete task; 'README.md entry alphabetically sorted within category (by skill name)'; 'Do not add star ratings, popularity counts, or verified badges... Describe what you tested in the pull request.' PR template has an 'I am the author: Yes/No' checkbox, so self-submission is allowed. Unacceptable: 'Spam or promotional content'. No minimum stars or age (stars are only a 'Bonus Point').
- **exact_action**: Fork, then add this row to README.md under '### Collaboration & Workflow' (two-column table 'Skill | Use it to'), alphabetically between the '[clueless]' row and the '[communication-protocol-setup]' row:
| [cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney) | Reply tersely in a Cockney voice, make the smallest correct change, and flag risky steps in plain English. |
Adjacent existing entry copied: '| [clueless](https://github.com/ADanMan/clueless/tree/main/skills/clueless) | Name assumptions, irreversible steps, and review gaps when a user needs extra guidance. |'. Closest analogue in the same section: '| [simple-man](https://github.com/Maksim-Burtsev/simple-man/tree/master/skills/simple-man) | Shorten agent replies while preserving findings, fixes, checks, and required facts. |'. PR title: 'Add cockney to Collaboration & Workflow'. Fill in the PR template (Skill Name, Category, Repository URL, author=Yes, checklist, testing notes).
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: User karanb192 (Karan Bansal). 544 stars. Created 2025-10-21, last push 2026-10-02. 88 of the last 100 closed PRs were merged (last merge 2026-10-02). Has CI link validation (.github/workflows/validate-links.yml).
- **red_flags**: 100+ open PRs (backlog). Small reach.
- **reach_estimate**: 544 stars; small but active and merges low-star skills (simple-man 11 stars, clueless 2 stars, both listed).
- **sources**: https://github.com/karanb192/awesome-claude-skills/blob/main/CONTRIBUTING.md · https://github.com/karanb192/awesome-claude-skills/blob/main/.github/PULL_REQUEST_TEMPLATE.md · https://github.com/karanb192/awesome-claude-skills/blob/main/.github/ISSUE_TEMPLATE/skill-submission.yml · https://raw.githubusercontent.com/karanb192/awesome-claude-skills/main/README.md · https://api.github.com/repos/karanb192/awesome-claude-skills

#### hesreallyhim/awesome-claude-code
- **url**: https://github.com/hesreallyhim/awesome-claude-code
- **type**: awesome-list
- **how_listed**: Web UI issue form only: https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml. 'Do not open a PR.' 'It is not possible to submit a resource recommendation using the gh CLI.' 'resource recommendations must be created by human beings.' Recommendations not made through the form risk temporary restriction from the repo.
- **requirements**: CONTRIBUTING GROUND RULES: '(i) Be at least 14 days old (14 days since first commit on default branch) AND show signs of active development (... additional commits after the first day); OR (ii) Have at least 100 stars.' 'You may not recommend more than one resource at a time.' 'Resources that fail these criteria will be closed automatically.' Enforced by .github/workflows/validate-new-issue.yml (const MIN_STARS = 100; const MIN_AGE_DAYS = 14; age measured from the oldest commit on the default branch; also checks the author's other open submissions). Style: 'descriptions should be written as descriptions - not a sales pitch. Don't address the reader... one line. Don't use any emojis.' The form wants a 10–500 character description of 1–3 sentences and a resource 'specific to Claude Code'. License is auto-detected, so LICENSE must be discoverable by GitHub. Self-promotion is not banned, but the maintainer warns 'If getting on the list is any part of a promotional strategy... be prepared to have a backup plan.'
- **exact_action**: On or after 2026-10-26T01:51Z (14 days after cockney's first commit 2026-10-12T01:51:14Z), with more commits pushed between now and then, or once the repo has 100 stars, a human fills in the web form:
Display Name: Cockney
Category: Skills
Link: https://github.com/Kadajett/cockney
Author Name: Jeremy Stover
Author Link: https://github.com/Kadajett
Description: A Claude Code skill and plugin that makes the agent reply tersely in a Cockney voice and make the smallest correct change: reuse existing code, standard library before new dependencies, no speculative abstractions. The accent drops for plain-English warnings on security issues and destructive or irreversible actions; lite/full/guvnor levels persist per session via hooks.
Tick every required checkbox and leave the final trap checkbox unticked.
The list's generated entry format, copied from Caveman: '- [Caveman](https://github.com/JuliusBrussee/caveman) by [Julius Brussee](https://github.com/JuliusBrussee) - A plugin that conserves message tokens by communicating in fragmented "caveman speak" ...' followed by the shields.io badges. Expected cockney render: '- [Cockney](https://github.com/Kadajett/cockney) by [Jeremy Stover](https://github.com/Kadajett) - <description>'.
- **caveman_listed**: yes: README '## Skills' section, first entry (line 599): '- [Caveman](https://github.com/JuliusBrussee/caveman) by [Julius Brussee](https://github.com/JuliusBrussee) - A plugin that conserves message tokens by communicating in fragmented "caveman speak" - sort of a clever form of compression. Now accompanied by a whole caveman ecosystem including a memory system, caveman spec kit, and a caveman agent.' Also in THE_RESOURCES_TABLE_NEW.csv (id 6de46512, Date Added 2026-07-28).
- **ponytail_listed**: no (absent from README and THE_RESOURCES_TABLE_NEW.csv despite 161k stars)
- **legitimacy**: User hesreallyhim. 55,471 stars. Created 2025-04-19, last push 2026-10-12. The largest Claude Code list; maintainer-curated with an automated form validator.
- **red_flags**: Highly selective, best-effort review, 'no guarantee... of a response'. The form requires 'specific to Claude Code'; cockney is multi-host but ships a Claude Code plugin and hooks, so frame it around those. Submissions not made by a human are against the rules.
- **reach_estimate**: 55k stars; the top Claude Code awesome list.
- **sources**: https://github.com/hesreallyhim/awesome-claude-code/blob/main/CONTRIBUTING.md · https://github.com/hesreallyhim/awesome-claude-code/blob/main/.github/ISSUE_TEMPLATE/recommend-resource.yml · https://github.com/hesreallyhim/awesome-claude-code/blob/main/.github/workflows/validate-new-issue.yml · https://raw.githubusercontent.com/hesreallyhim/awesome-claude-code/main/README.md · https://raw.githubusercontent.com/hesreallyhim/awesome-claude-code/main/THE_RESOURCES_TABLE_NEW.csv · https://api.github.com/repos/hesreallyhim/awesome-claude-code

#### VoltAgent/awesome-agent-skills (VoltAgent/awesome-claude-skills redirects here)
- **url**: https://github.com/VoltAgent/awesome-agent-skills
- **type**: awesome-list
- **how_listed**: PR to README.md
- **requirements**: CONTRIBUTING: entry format '- **[author/skill-name](https://github.com/author/repo/path)** - Short description'; 'Add to the end of the matching subcategory under "Community Skills"'; 'Author/org prefix included in the name'; 'Description must be short, 10 words or fewer'; 'Skill must have real community usage... Brand new skills that were just created are not accepted. Give your skill time to mature and gain users before submitting.' README adds: 'Please don't submit skills you created 3 hours ago.' Quality criteria: third-person description, top-level metadata under ~100 tokens, body under 500 lines, no absolute paths. PR title 'Add skill: author/skill-name'. No numeric star or age threshold.
- **exact_action**: After cockney has some real usage, append to the end of 'Community Skills > Context Engineering' (the <details> block with <summary><h3 style="display:inline">Context Engineering</h3></summary>, last entry currently Qiuner/birdview):
- **[Kadajett/cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney)** - Terse Cockney replies, smallest correct change, plain-English risk warnings
Adjacent analogue copied from the same block: '- **[ruslanlap/cavemenko](https://github.com/ruslanlap/cavemenko/tree/main/skills/cavemenko)** - Ukrainian pro-drop reply style, measured -49% tokens'. PR title: 'Add skill: Kadajett/cockney'.
- **caveman_listed**: no (only a caveman-derived skill, ruslanlap/cavemenko, which has 4 stars)
- **ponytail_listed**: no
- **legitimacy**: Org VoltAgent. 35,535 stars. Created 2025-10-28, last push 2026-10-11. 37 of the last 100 closed PRs merged (last 2026-10-11); 46 open.
- **red_flags**: Explicit maturity rule against brand-new skills. cockney's SKILL.md description (~80 words) is near the '~100 tokens' metadata guideline.
- **reach_estimate**: 35.5k stars; accepted a 4-star caveman-style skill, so stars aren't strictly gated.
- **sources**: https://github.com/VoltAgent/awesome-agent-skills/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/VoltAgent/awesome-agent-skills/main/README.md · https://api.github.com/repos/VoltAgent/awesome-agent-skills

#### ComposioHQ/awesome-claude-skills
- **url**: https://github.com/ComposioHQ/awesome-claude-skills
- **type**: awesome-list
- **how_listed**: PR to README.md (an external-repo link; the CONTRIBUTING folder-copy path is for in-repo skills)
- **requirements**: CONTRIBUTING: real use case, well-documented, examples, 'Be tested', 'Be safe - Confirm before destructive operations'; 'Add your skill in alphabetical order within the category'; 'no emojis, consistent punctuation'; PR title 'Add [Skill Name] skill'. Bot workflow .github/workflows/label-ready-skill.yml adds a 'ready-to-merge' label only if: the PR changes README.md alone; edits stay between '## Skills' and '## Getting Started'; each new bullet links to an external https URL; added lines contain none of the blocked words /crypto|cryptocurrency|web3|blockchain|nft|defi|token(omics)?|wallet|solana|ethereum|bitcoin/i (so NO 'token'); the bullet is alphabetical (case-insensitive) relative to its neighbours. No star or age rule.
- **exact_action**: In README.md '### Development & Code Tools', insert between '- [Claude Code Terminal Title](...)' and '- [Connect](./connect/)':
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. *By [@Kadajett](https://github.com/Kadajett)*
Adjacent entry format copied: '- [D3.js Visualization](https://github.com/chrisvoncsefalvay/claude-d3js-skill) - Teaches Claude to produce D3 charts and interactive data visualizations. *By [@chrisvoncsefalvay](https://github.com/chrisvoncsefalvay)*'. PR title: 'Add cockney skill'.
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: Org ComposioHQ (commercial; README promotes the Composio product). 76,900 stars. Created 2025-10-17, last push 2026-09-18. 0 of the last 100 closed PRs merged. README history shows a few merged PRs (last 2026-05-22) and maintainer 'Update README.md' commits (last 2026-07-24).
- **red_flags**: Very low merge rate and a huge open PR queue; a similar 'distill: professional low-token mode skill' PR was closed unmerged. A vendor-run list.
- **reach_estimate**: 76.9k stars; highest reach but lowest odds.
- **sources**: https://github.com/ComposioHQ/awesome-claude-skills/blob/master/CONTRIBUTING.md · https://github.com/ComposioHQ/awesome-claude-skills/blob/master/.github/workflows/label-ready-skill.yml · https://raw.githubusercontent.com/ComposioHQ/awesome-claude-skills/master/README.md · https://api.github.com/repos/ComposioHQ/awesome-claude-skills/commits?path=README.md

#### BehiSecc/awesome-claude-skills
- **url**: https://github.com/BehiSecc/awesome-claude-skills
- **type**: awesome-list
- **how_listed**: PR to README.md. The maintainer batch-imports from open PRs in direct commits (e.g. 2026-08-02 'Add 25 curated Claude skills from open PRs'), so PRs show as closed rather than merged.
- **requirements**: README '## 🤝 Contribution': 'Fork this repo / Make your changes / Submit a Pull Request'. No CONTRIBUTING file. The maintainer's batch commit says entries must be 'skill-only, well-formatted, non-duplicate, and meet the star threshold'; the threshold value is not published [UNVERIFIED number]. Descriptions get shortened.
- **exact_action**: Append to the end of '## 🛠 Development & Code Tools' (after the mailtrap-skills line):
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky.
Adjacent entry format copied: '- [mailtrap-skills](https://github.com/mailtrap/mailtrap-skills) - Agent skills for Mailtrap email sending, sandbox testing, domain setup, and contacts management.'
- **caveman_listed**: no (same author's JuliusBrussee/blueprint is listed: '- [Blueprint](https://github.com/JuliusBrussee/blueprint) - Specification-driven development skill...')
- **ponytail_listed**: no
- **legitimacy**: User BehiSecc. 10,236 stars. Created 2025-10-17, last push 2026-09-21. Batch curation roughly every 2 months.
- **red_flags**: Unpublished star threshold; README carries paid sponsor banners (Atlas Cloud, APIMart).
- **reach_estimate**: 10.2k stars
- **sources**: https://raw.githubusercontent.com/BehiSecc/awesome-claude-skills/main/README.md · https://api.github.com/repos/BehiSecc/awesome-claude-skills/commits?path=README.md

#### travisvn/awesome-claude-skills
- **url**: https://github.com/travisvn/awesome-claude-skills
- **type**: awesome-list
- **how_listed**: PR to README.md (one item per PR)
- **requirements**: CONTRIBUTING: 'if your skill hasn't acquired a basic 10 stars, it will be closed automatically'. 'the PR not be explicitly generated / submitted with AI-assistance... PRs will be closed without comment if the submitter has failed to acknowledge this'. No SaaS wrappers or promotion. 'Trivial functionalities that were whipped up with a session or two with Claude Code are not likely to be worthwhile'. 'more exists to the skill than a single SKILL.md' (cockney has hooks and an eval, which helps). 'Be functional and tested'. Title e.g. 'Add cockney skill'.
- **exact_action**: Once cockney has 10+ stars, a human opens a PR adding a row to the 'Individual Skills' table under '## 🌟 Community Skills', placed at the end before the '_More community skills coming soon!_' line:
| **[cockney](https://github.com/Kadajett/cockney)** | Terse Cockney-voiced coding mode: smallest correct change, plain-English warnings for anything risky |
Adjacent entry format copied: '| **[get-shit-done](https://github.com/gsd-build/get-shit-done)** | Lightweight meta-prompting, context engineering, and spec-driven development system for Claude Code by TÂCHES |'. The PR description should state it was written by a human and list prerequisites (Node for hooks) and the license (MIT).
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: User travisvn. 15,370 stars. Created 2025-10-16, last push 2026-04-28. 0 of the last 100 closed PRs merged. The maintainer adds entries himself (last 2026-04-28 'Add get-shit-done').
- **red_flags**: Effectively dormant since April 2026; anti-AI-PR rule; 10-star auto-close.
- **reach_estimate**: 15.4k stars, but stale.
- **sources**: https://github.com/travisvn/awesome-claude-skills/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/travisvn/awesome-claude-skills/main/README.md · https://api.github.com/repos/travisvn/awesome-claude-skills/commits?path=README.md

#### jqueryscript/awesome-claude-code
- **url**: https://github.com/jqueryscript/awesome-claude-code
- **type**: awesome-list
- **how_listed**: Maintainer-curated batch updates (README commits 'Add Claude Code resources from September and October', 2026-10-07). Contribution Guidelines say only '**Under Construction**'. People open PRs and issues (e.g. 'Add X to Claude Plugins'), but 0 of the last 100 closed PRs were merged. Mirrored at https://www.scriptbyai.com/claude-code-resource-list/
- **requirements**: None published. Agent Skills entries appear sorted by star count, with the star count shown.
- **exact_action**: Open an issue (or PR) titled 'Add cockney to Agent Skills' with this line, matching the '## 🧠 Agent Skills' format:
- [**cockney**](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode for Claude Code and Codex: terse replies, the smallest correct change, plain-English warnings for anything risky.
The maintainer adds a '(N ⭐) - ' segment for starred repos, e.g. '- [**caveman**](https://github.com/JuliusBrussee/caveman) - (72.4k ⭐) - A Claude Code skill/plugin and Codex plugin that makes agent talk like caveman — cutting ~75% of output tokens while keeping full technical accuracy.' An alternative is '## 🔌 Claude Plugins', where ponytail sits without a star count.
- **caveman_listed**: yes: '## 🧠 Agent Skills' line 123: '- [**caveman**](https://github.com/JuliusBrussee/caveman) - (72.4k ⭐) - A Claude Code skill/plugin and Codex plugin that makes agent talk like caveman — cutting ~75% of output tokens while keeping full technical accuracy.'
- **ponytail_listed**: yes: '## 🔌 Claude Plugins' line 487: '- [**ponytail**](https://github.com/DietrichGebert/ponytail) - Makes your AI agent think like the laziest senior dev in the room.'
- **legitimacy**: User jqueryscript (runs scriptbyai.com). 527 stars. Created 2025-07-13, last push 2026-10-07. Updated every 1–2 weeks.
- **red_flags**: No submission process; about 620 open issues and PRs; inclusion is up to the maintainer.
- **reach_estimate**: 527 stars plus the scriptbyai.com mirror.
- **sources**: https://raw.githubusercontent.com/jqueryscript/awesome-claude-code/main/README.md · https://api.github.com/repos/jqueryscript/awesome-claude-code · https://api.github.com/repos/jqueryscript/awesome-claude-code/commits?path=README.md

#### ccplugins/awesome-claude-code-plugins
- **url**: https://github.com/ccplugins/awesome-claude-code-plugins
- **type**: plugin-marketplace
- **how_listed**: PR: either a README-only external link, or vendoring plugins/<name>/ plus a .claude-plugin/marketplace.json entry (e.g. the claude-session-tint PR)
- **requirements**: README '## Contributing': 'Contributions are welcome! You can add your favorite plugins, share best practices, or submit your own marketplace.' Nothing else is stated.
- **exact_action**: README-only PR adding under '### Workflow Orchestration' (where the token-saver espresso sits; entries are appended, not alphabetical):
- [cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. Install via `/plugin marketplace add Kadajett/cockney`.
Adjacent entry format copied: '- [espresso](https://github.com/mirkobozzetto/espresso) - Full token-saving stack. Output compression, global rules, RTK, Caveman, GitNexus auto-config. Detects existing setup, installs only what's missing.'
- **caveman_listed**: no (only mentioned inside the espresso description)
- **ponytail_listed**: no
- **legitimacy**: Org ccplugins. 970 stars. Created 2025-10-13, last push 2026-08-12. All 53 merges in the last 100 closed PRs landed in Aug 2026 ('Resolve plugin contribution backlog').
- **red_flags**: Merges in bulk with little curation (ad-network MCPs merged); dormant since 2026-08-12.
- **reach_estimate**: 970 stars
- **sources**: https://raw.githubusercontent.com/ccplugins/awesome-claude-code-plugins/main/README.md · https://api.github.com/repos/ccplugins/awesome-claude-code-plugins/pulls?state=closed

#### quemsah/awesome-claude-plugins (awesomeclaudeplugins.com)
- **url**: https://github.com/quemsah/awesome-claude-plugins
- **type**: aggregator
- **how_listed**: Automatic indexing from GitHub. The crawler (crawler/src/crawl/discover.ts) uses GitHub code search for '.claude-plugin/marketplace.json' (query families marketplace_path_literal / marketplace_filename_path), then reads HEAD:.claude-plugin/marketplace.json. The README shows the top 100 by stars; the full index is on https://awesomeclaudeplugins.com
- **requirements**: A valid public .claude-plugin/marketplace.json; cockney already has one. The README top-100 needs about 15k+ stars.
- **exact_action**: None. Wait for the crawler (README says 'Last updated: 12.10.2026 with 46179 total repositories indexed'). Check https://awesomeclaudeplugins.com for Kadajett/cockney after GitHub code search indexes the repo.
- **caveman_listed**: yes: README rank 11: '| 11 | [caveman](https://github.com/JuliusBrussee/caveman) | 🪨 why use many token when few token do trick. ... | 111052 | 253 | 1 |'
- **ponytail_listed**: yes: README rank 7: '| 7 | [ponytail](https://github.com/DietrichGebert/ponytail) | Makes your AI agent think like the laziest senior dev in the room. ... | 161100 | 366 | 1 |'
- **legitimacy**: User quemsah. 1,425 stars. Created 2025-10-30, last push 2026-10-12 (daily automation).
- **red_flags**: None; passive.
- **reach_estimate**: 1.4k stars plus the website
- **sources**: https://raw.githubusercontent.com/quemsah/awesome-claude-plugins/main/README.md · https://github.com/quemsah/awesome-claude-plugins/tree/main/crawler/src/crawl · https://api.github.com/repos/quemsah/awesome-claude-plugins

#### alvinreal/awesome-opensource-ai
- **url**: https://github.com/alvinreal/awesome-opensource-ai
- **type**: awesome-list
- **how_listed**: PR to README.md with the checklist from CONTRIBUTING
- **requirements**: CONTRIBUTING: 'Projects do not need a minimum number of GitHub stars'. Prefer an OSI license, working code, docs, active maintenance, 'meaningful distinction from similar projects'. Avoid 'shallow demos or thin wrappers', 'hype-heavy descriptions'. 'Write a factual one-sentence description'. Run 'python3 tools/validate_awesome.py --skip-remote'. The PR description needs a Project / Why it belongs / Quality signals checklist (license, maintenance, docs, distinction). 'Maintainers may... Accept small or newer projects'.
- **exact_action**: Append to '## 13. Developer Tools & Integrations > #### IDE Plugins & Extensions' (where Caveman sits; append at the end, after jev-use):
- [Cockney](https://github.com/Kadajett/cockney) - Skill, Claude Code plugin and install script for omp, Claude Code and Codex that makes coding agents reply tersely in a Cockney voice and make the smallest correct change, with plain-English warnings for risky actions. MIT licensed. ![GitHub stars](https://img.shields.io/github/stars/Kadajett/cockney?style=social)
Adjacent entry format copied: '- [Caveman](https://github.com/JuliusBrussee/caveman) - Skill and setup script for Claude Code, Codex, Gemini, Cursor, and other coding agents that reduces token output by instructing agents to communicate in concise, caveman-style prose. MIT licensed. ![GitHub stars](https://img.shields.io/github/stars/JuliusBrussee/caveman?style=social)'
- **caveman_listed**: yes: line 1401 under '#### IDE Plugins & Extensions' (quoted above)
- **ponytail_listed**: no
- **legitimacy**: User alvinreal. 4,870 stars. Created 2026-03-24, last push 2026-10-11. 92 of the last 100 closed PRs merged (last 2026-10-11).
- **red_flags**: 'Distinction from similar projects' will be judged against Caveman already being listed; stress minimal-diff plus the safety switch, not token savings.
- **reach_estimate**: 4.9k stars, very active
- **sources**: https://github.com/alvinreal/awesome-opensource-ai/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/alvinreal/awesome-opensource-ai/main/README.md

#### abubakarsiddik31/claude-skills-collection
- **url**: https://github.com/abubakarsiddik31/claude-skills-collection
- **type**: awesome-list
- **how_listed**: PR, or an issue with the repo link
- **requirements**: README '## Contributing': 'Open a pull request or submit your repo link in an issue with: Name of the skill, Short description, Category, Link to the source'. No star or age rules stated.
- **exact_action**: Add a row to the table under '## 💻 Development & Code Tools' (append; the ponytail row is there):
| **cockney** | Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky, with lite/full/guvnor levels | [Source](https://github.com/Kadajett/cockney/tree/master/skills/cockney) |
Adjacent entry format copied: '| **ponytail** | Forces the laziest solution that actually works — YAGNI, standard library before custom code, one line before fifty, with lite/full/ultra intensity levels | [Source](https://github.com/DietrichGebert/ponytail/tree/main/skills/ponytail) |'
- **caveman_listed**: no
- **ponytail_listed**: yes: '## 💻 Development & Code Tools' line 206 (quoted above)
- **legitimacy**: User abubakarsiddik31. 1,095 stars. Created 2025-10-18, last push 2026-09-12. 28 of 36 closed PRs merged; 17 open.
- **red_flags**: None notable.
- **reach_estimate**: 1.1k stars
- **sources**: https://raw.githubusercontent.com/abubakarsiddik31/claude-skills-collection/main/README.md · https://api.github.com/repos/abubakarsiddik31/claude-skills-collection

#### RoggeOhta/awesome-codex-cli
- **url**: https://github.com/RoggeOhta/awesome-codex-cli
- **type**: awesome-list
- **how_listed**: An issue works best. CONTRIBUTING: '[Open an issue] with the link and a brief description' or fork+PR. 0 of 45 closed PRs merged, but suggestion issues are closed as 'completed' when the maintainer adds them (commit 2026-09-06 'Maintain resource list and resolve verified submissions').
- **requirements**: 'Be directly related to Codex CLI'; actively maintained (<6 months); one-sentence description; 'Include star badge'. Won't accept: 'Self-promotion without substance — your project needs real users or a clear unique value.'
- **exact_action**: Open an issue at https://github.com/RoggeOhta/awesome-codex-cli/issues/new proposing this line for '## Skills > ### Specialized Skills':
- [Kadajett/cockney](https://github.com/Kadajett/cockney) - Cockney-voiced skill for terse Codex replies and the smallest correct change, with plain-English warnings for risky actions. ![GitHub stars](https://img.shields.io/github/stars/Kadajett/cockney?style=flat-square)
Adjacent analogue copied: '- [Cpp1022/concise](https://github.com/Cpp1022/concise) - Chinese-first instructions for concise Codex replies, with a shared SKILL.md rule source. ![GitHub stars](https://img.shields.io/github/stars/Cpp1022/concise?style=flat-square)'
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: User RoggeOhta. 548 stars. Created 2026-03-31, last push 2026-09-06.
- **red_flags**: cockney's README says the Codex install is 'files only: the Codex CLI's login was broken on this box, so no live turn'. Run a live Codex test before claiming Codex support. Low-star analogue concise (3 stars) is accepted.
- **reach_estimate**: 548 stars
- **sources**: https://github.com/RoggeOhta/awesome-codex-cli/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/RoggeOhta/awesome-codex-cli/main/README.md · https://api.github.com/repos/RoggeOhta/awesome-codex-cli/issues?state=closed

#### composio-community/awesome-codex-skills
- **url**: https://github.com/composio-community/awesome-codex-skills
- **type**: awesome-list
- **how_listed**: PR to README.md (external link plus a Codex skill-installer command)
- **requirements**: README '## Contributing': 'PRs welcome. Add real, reusable skills, keep descriptions precise... ensure the `description` clearly states when Codex should trigger and test that metadata fits within context limits.' Development section is roughly alphabetical.
- **exact_action**: In '### Development & Code Tools', insert between the 'bringyour-migration-auditor' and 'codebase-migrate/' lines:
- [cockney](https://github.com/Kadajett/cockney/tree/master/skills/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, plain-English warnings for anything risky. Install: `python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Kadajett/cockney --path skills/cockney --name cockney`
Format copied from: '- [brooks-lint](https://github.com/hyhmrright/brooks-lint) - AI code reviews grounded in six classic engineering books — ... Install: `python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo hyhmrright/brooks-lint --path skills/brooks-lint --name brooks-lint`'
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: Org composio-community (Composio). 16,868 stars. Created 2026-01-12, last push 2026-07-26. 17 of 63 closed PRs merged (last 2026-07-26); 100+ open.
- **red_flags**: No merges since July 2026; Codex support not live-tested (see repo_changes).
- **reach_estimate**: 16.9k stars
- **sources**: https://raw.githubusercontent.com/composio-community/awesome-codex-skills/master/README.md · https://api.github.com/repos/composio-community/awesome-codex-skills

#### hashgraph-online/awesome-codex-plugins
- **url**: https://github.com/hashgraph-online/awesome-codex-plugins
- **type**: plugin-marketplace
- **how_listed**: PR adding one README.md line (a generator mirrors the bundle into plugins/<owner>/<repo> and regenerates plugins.json/marketplace.json). Issue form plugin-submission.yml also exists.
- **requirements**: Source repo must contain '.codex-plugin/plugin.json (valid manifest)' with composerIcon set, 'SECURITY.md', 'LICENSE', 'README.md', no secrets or dangerous commands, SHA-pinned Actions, 'Dependency lockfiles'. Must pass the HOL AI Plugin Scanner: 'Score >= 80/130' with no critical/high findings ('pipx install --force "plugin-scanner==3.42.0"; plugin-scanner scan . --format text'). README line: 'One plugin per line; Alphabetical order within each category; Description must be a single sentence; Link must point to the GitHub repository root'. Do not commit plugin files to their repo.
- **exact_action**: After the repo_changes below, add in '## Community Plugins > ### Development & Workflow' (alphabetical by display name):
- [Cockney](https://github.com/Kadajett/cockney) - Cheeky Cockney coding mode: terse replies, the smallest correct change, and plain-English warnings for anything risky.
Adjacent entry format copied: '- [Clueless](https://github.com/ADanMan/clueless) - Responsibility-flip mode for when the user cannot review the output: irreversible steps first, ...'
- **caveman_listed**: no (only mirrored inside other bundles, e.g. plugins/JuliusBrussee/blueprint/skills/caveman)
- **ponytail_listed**: no (only mirrored in plugins/mirkobozzetto/espresso/skills/ponytail-*)
- **legitimacy**: Org hashgraph-online (HOL). 1,284 stars. Created 2026-03-28, last push 2026-10-11. 97 of the last 100 closed PRs merged.
- **red_flags**: Heavy compliance work (manifest, SECURITY.md, icon, scanner). Codex is not live-tested.
- **reach_estimate**: 1.3k stars; also serves as a Codex marketplace source
- **sources**: https://github.com/hashgraph-online/awesome-codex-plugins/blob/main/CONTRIBUTING.md · https://github.com/hashgraph-online/awesome-codex-plugins/blob/main/.github/ISSUE_TEMPLATE/plugin-submission.yml · https://raw.githubusercontent.com/hashgraph-online/awesome-codex-plugins/main/plugins/ADanMan/clueless/.codex-plugin/plugin.json

#### JackyST0/awesome-agent-skills
- **url**: https://github.com/JackyST0/awesome-agent-skills
- **type**: awesome-list
- **how_listed**: PR editing both README.md and README_ZH.md
- **requirements**: CONTRIBUTING: 'Community projects require at least **64 GitHub Stars** by default' (社区项目默认需要至少 64 GitHub Stars). A single-skill repo must contain SKILL.md. Must update README.md and README_ZH.md together; 'npm run check' runs locally. Don't add a new section for one project.
- **exact_action**: Once cockney has 64+ stars, add to '## Development Tools' in README.md:
- [cockney](https://github.com/Kadajett/cockney) - Terse Cockney-voiced coding mode: smallest correct change, plain-English warnings for risky steps.
Add the same entry, with a Chinese description, to README_ZH.md. Format copied: '- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) - Production-grade engineering skills and slash-command workflows for AI coding agents.'
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: User JackyST0. 651 stars. Created 2026-01-28, last push 2026-10-12. 36 of the last 100 closed PRs merged; 1 open.
- **red_flags**: 64-star gate.
- **reach_estimate**: 651 stars
- **sources**: https://github.com/JackyST0/awesome-agent-skills/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/JackyST0/awesome-agent-skills/main/README.md

#### ai-boost/awesome-harness-engineering
- **url**: https://github.com/ai-boost/awesome-harness-engineering
- **type**: awesome-list
- **how_listed**: PR to README.md
- **requirements**: CONTRIBUTING: must 'Address a specific harness problem'; 'Is worth someone's time... Include a 1–2 sentence note explaining why'; format '- [Title](URL) — 1–2 sentence note explaining why it's worth including.' (em dash).
- **exact_action**: Under '### Skills & MCP' (where Ponytail sits):
- [Cockney](https://github.com/Kadajett/cockney) — Persona skill that pairs a minimal-diff ruleset (reuse, stdlib before dependencies, no speculative abstractions) with hook-enforced activation and level persistence, and drops the persona for plain-English warnings on destructive or security-relevant actions; ships a 19-task eval comparing it with caveman and ponytail.
Format copied: '- [Ponytail](https://github.com/DietrichGebert/ponytail) — Skill that makes coding agents behave like a "lazy senior dev": prefer built-in solutions, avoid new dependencies, and write the minimum code that works. ...'
- **caveman_listed**: no
- **ponytail_listed**: yes: '### Skills & MCP' line 239 (quoted above)
- **legitimacy**: User ai-boost. 4,794 stars. Created 2026-03-29, last push 2026-10-11. Only 2 of 56 closed PRs merged; the maintainer adds most entries in daily commits.
- **red_flags**: Low PR merge rate; research-oriented.
- **reach_estimate**: 4.8k stars
- **sources**: https://github.com/ai-boost/awesome-harness-engineering/blob/main/CONTRIBUTING.md · https://raw.githubusercontent.com/ai-boost/awesome-harness-engineering/main/README.md

#### sickn33/agentic-awesome-skills
- **url**: https://github.com/sickn33/agentic-awesome-skills
- **type**: registry
- **how_listed**: PR that vendors the skill into skills/<name>/SKILL.md with the repo's frontmatter (source: community, source_repo: Kadajett/cockney, source_type: community, risk, tools, ...). 'npm run validate' must pass; source-only PR (no CATALOG.md / skills_index.json / data/*.json).
- **requirements**: Follow docs/contributors/skill-template.md; manual logic/safety review; enable 'Allow edits from maintainers'.
- **exact_action**: skills/cockney/SKILL.md copied from Kadajett/cockney with frontmatter fields name, description, category: development, risk: safe, source: community, source_repo: Kadajett/cockney, source_type: community, date_added, author: Kadajett, tags: [coding-style, minimal-diff, persona], tools: [claude, codex]. Commit 'feat: add cockney for terse minimal-diff coding'.
- **caveman_listed**: no
- **ponytail_listed**: no
- **legitimacy**: User sickn33. 47,477 stars. Created 2026-01-14, last push 2026-10-12. 95 of the last 100 closed PRs merged.
- **red_flags**: Vendored copy carries only SKILL.md (the hooks/level persistence are lost), and the copy diverges from upstream.
- **reach_estimate**: 47k stars, 2,677+ skills
- **sources**: https://github.com/sickn33/agentic-awesome-skills/blob/main/CONTRIBUTING.md · https://api.github.com/repos/sickn33/agentic-awesome-skills

**Skipped:**
- [heilcheng/awesome-agent-skills (Agent Skill Index)](https://github.com/heilcheng/awesome-agent-skills): Dormant: last push 2026-04-05; 13 of 100 closed PRs merged; 100+ open. The CONTRIBUTING includes a sponsorship pitch. If attempted, the format is '- [Kadajett/cockney](https://github.com/Kadajett/cockney) - Terse Cockney replies with the smallest correct change' under Community Skills > Development and Testing. Caveman and ponytail not listed. 6,266 stars.
- [Piebald-AI/awesome-gemini-cli](https://github.com/Piebald-AI/awesome-gemini-cli): Entries must be 'related to Gemini CLI'. Cockney does not claim or test Gemini CLI support (README: omp, Claude Code, Codex, AGENTS.md). Revisit only if a tested Gemini install is added; then add '- [Cockney](https://github.com/Kadajett/cockney) - Description' to the bottom of '## Commands & Extensions'. 512 stars; merges actively (98/100).
- [awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode): OpenCode-specific; cockney has no OpenCode integration.
- [karanb192/awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods): Only catalogues JS/TS 'function hook' mods (hooks.json with a 'modules' key / CLAUDE_CODE_ENABLE_FUNCTION_HOOKS). Cockney's hooks.json uses type: command hooks.
- [VoltAgent/awesome-codex-subagents, VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-codex-subagents): Subagent definitions only, not skills.
- [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit): Stale (last push 2026-05-12).
- [skillmatic-ai/awesome-agent-skills](https://github.com/skillmatic-ai/awesome-agent-skills): Stale (last push 2026-05-14), 683 stars.
- [helloianneo/awesome-claude-code-skills](https://github.com/helloianneo/awesome-claude-code-skills): Stale (last push 2026-04-13), under 500 stars.
- [itgoyo/awesome-agent-skills](https://github.com/itgoyo/awesome-agent-skills): 206 stars, stale (last push 2026-04-28), though it lists caveman: '| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 48.6k ⭐ | ... |'.
- [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills): Chinese-language curated list with no published contribution process; 6 of 28 closed PRs merged, 100+ open. Caveman and ponytail not listed. 5,159 stars. Low odds.
- [ai-boost/awesome-prompts](https://github.com/ai-boost/awesome-prompts): Lists maintainer-written prompt files derived from projects (e.g. '| 🪨 Caveman Mode | ... based on JuliusBrussee/caveman (Apr 2026) | [prompt](.../prompts/caveman_mode.txt) |' and '| 🐴 Ponytail Lazy Senior Dev Architect | ... based on DietrichGebert/ponytail ...'), not project links. No CONTRIBUTING. Could get an adaptation once popular, but there is no submission path for the repo itself.
- [LinklyAI/best-skills, EvanLi/Github-Ranking, uhub/awesome-*, trackawesomelist](https://github.com/LinklyAI/best-skills): Automatic rankings from installs, stars and social buzz (LinklyAI lists ponytail at rank 5: '| 5 | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | 161,114 | 2026-10-10 |'). No submission; inclusion follows adoption.
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness): DeepSeek-harness (dsh) plugins only; it lists a dsh port of ponytail, not the original.
