#!/usr/bin/env bash
# Install the cockney skill for omp, Claude Code, Codex, or any agent that reads AGENTS.md.
#
#   ./install.sh                     every host found on this machine
#   ./install.sh --omp --claude      only these hosts (also: --codex, --agents-md FILE)
#   ./install.sh --claude-plugin     Claude Code via its plugin system instead of settings.json
#   ./install.sh --uninstall [...]   remove what the same flags would install
#   ./install.sh --dry-run [...]     print the actions only
#
# Honours HOME, PI_CODING_AGENT_DIR (omp), CLAUDE_CONFIG_DIR and CODEX_HOME, so
# `HOME=$(mktemp -d) ./install.sh` is a safe trial run.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OMP_DIR="${PI_CODING_AGENT_DIR:-$HOME/.omp/agent}"
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
CODEX_DIR="${CODEX_HOME:-$HOME/.codex}"
BEGIN="<!-- cockney:begin -->"
END="<!-- cockney:end -->"

hosts=() agents_md=() uninstall=0 dry=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --omp | --claude | --claude-plugin | --codex) hosts+=("${1#--}") ;;
    --agents-md) agents_md+=("${2:?--agents-md needs a file}"); shift ;;
    --uninstall) uninstall=1 ;;
    --dry-run) dry=1 ;;
    -h | --help) sed -n '2,11p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

run() { if ((dry)); then echo "would: $*"; else "$@"; fi; }
say() { echo "cockney: $*"; }

command -v node >/dev/null || { echo "cockney needs node (>= 22.18, for TypeScript hooks)" >&2; exit 1; }

if [[ ${#hosts[@]} -eq 0 && ${#agents_md[@]} -eq 0 ]]; then
  [[ -d "$OMP_DIR" ]] || command -v omp >/dev/null && hosts+=(omp)
  [[ -d "$CLAUDE_DIR" ]] || command -v claude >/dev/null && hosts+=(claude)
  [[ -d "$CODEX_DIR" ]] || command -v codex >/dev/null && hosts+=(codex)
  [[ ${#hosts[@]} -gt 0 ]] || { echo "no agent found; pass --omp, --claude, --codex or --agents-md FILE" >&2; exit 1; }
fi

copy_skill() { # dest dir, plus optional hook files to ship beside it
  local dest="$1"; shift
  run mkdir -p "$dest"
  run cp "$REPO/skills/cockney/SKILL.md" "$dest/SKILL.md"
  for f in "$@"; do run mkdir -p "$dest/hooks"; run cp "$REPO/hooks/$f" "$dest/hooks/$f"; done
}

# Replace (or drop, when $2 is empty) the marked cockney block in a Markdown file.
write_block() {
  local file="$1" body="$2" tmp
  if ((dry)); then echo "would: update cockney block in $file"; return; fi
  mkdir -p "$(dirname "$file")"; touch "$file"
  tmp="$(mktemp)"
  awk -v b="$BEGIN" -v e="$END" '$0==b{skip=1} !skip{print} $0==e{skip=0}' "$file" >"$tmp"
  [[ -n "$body" ]] && printf '%s\n%s\n%s\n' "$BEGIN" "$body" "$END" >>"$tmp"
  mv "$tmp" "$file"
}

agents_block() {
  printf '%s\n\n' "Cockney mode is always on. Levels: say \"/cockney lite\", \"/cockney full\" or \"/cockney guvnor\" to switch, \"speak proper\" to stop; keep the chosen level for the rest of the conversation."
  node "$REPO/hooks/ruleset.ts" full
}

install_omp() {
  copy_skill "$OMP_DIR/skills/cockney"
  run mkdir -p "$OMP_DIR/extensions/cockney"
  run cp "$REPO/hooks/omp.ts" "$OMP_DIR/extensions/cockney/index.ts"
  run cp "$REPO/hooks/ruleset.ts" "$OMP_DIR/extensions/cockney/ruleset.ts"
  say "omp: skill + always-on extension in $OMP_DIR"
}

install_claude() {
  copy_skill "$CLAUDE_DIR/skills/cockney" claude.ts ruleset.ts
  run node "$REPO/hooks/claude-settings.ts" add "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/skills/cockney/hooks/claude.ts"
  say "Claude Code: skill + SessionStart/UserPromptSubmit hooks in $CLAUDE_DIR/settings.json"
}

install_claude_plugin() {
  run claude plugin marketplace add "$REPO"
  run claude plugin install cockney@cockney
  say "Claude Code: plugin cockney@cockney installed from $REPO"
}

install_codex() {
  copy_skill "$CODEX_DIR/skills/cockney"
  write_block "$CODEX_DIR/AGENTS.md" "$(agents_block)"
  say "Codex: skill + always-on block in $CODEX_DIR/AGENTS.md"
}

uninstall_host() {
  case "$1" in
    omp) run rm -rf "$OMP_DIR/skills/cockney" "$OMP_DIR/extensions/cockney" ;;
    claude)
      [[ -f "$CLAUDE_DIR/settings.json" ]] && run node "$REPO/hooks/claude-settings.ts" remove "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/skills/cockney/hooks/claude.ts"
      run rm -rf "$CLAUDE_DIR/skills/cockney" ;;
    claude-plugin) run claude plugin uninstall cockney@cockney; run claude plugin marketplace remove cockney ;;
    codex) run rm -rf "$CODEX_DIR/skills/cockney"; [[ -f "$CODEX_DIR/AGENTS.md" ]] && write_block "$CODEX_DIR/AGENTS.md" "" ;;
  esac
  say "removed from $1"
}

for host in "${hosts[@]}"; do
  if ((uninstall)); then uninstall_host "$host"; else "install_${host//-/_}"; fi
done
for file in "${agents_md[@]}"; do
  if ((uninstall)); then write_block "$file" ""; say "removed block from $file"
  else write_block "$file" "$(agents_block)"; say "always-on block written to $file"; fi
done
