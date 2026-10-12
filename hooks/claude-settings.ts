// install.sh helper: `node claude-settings.ts add|remove <settings.json> <claude.ts path>`.
// Adds or removes the cockney SessionStart/UserPromptSubmit hooks in a Claude Code settings file,
// leaving every other setting and hook untouched.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

type HookCommand = { type: "command"; command: string; timeout?: number };
type HookGroup = { matcher?: string; hooks: HookCommand[] };
type Settings = { hooks?: Record<string, HookGroup[]> } & Record<string, unknown>;

const [action, settingsPath, hookScript] = process.argv.slice(2);
if (!settingsPath || !hookScript || (action !== "add" && action !== "remove")) {
  throw new Error("usage: claude-settings.ts add|remove <settings.json> <claude.ts>");
}

const MARK = "cockney/hooks/claude.ts";
// Claude Code's settings.json: a JSON object, `hooks` keyed by event name.
const settings: Settings = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, "utf8")) : {};
const hooks = settings.hooks ?? {};
const ours = (group: HookGroup) => group.hooks.some((h) => h.command.includes(MARK));

for (const event of ["SessionStart", "UserPromptSubmit"]) {
  const kept = (hooks[event] ?? []).filter((group) => !ours(group));
  if (kept.length > 0) hooks[event] = kept;
  else delete hooks[event];
}

if (action === "add") {
  const command = (arg: string): HookCommand => ({
    type: "command",
    command: `command -v node >/dev/null 2>&1 || exit 0; node "${hookScript}" ${arg}`,
    timeout: 10,
  });
  hooks.SessionStart = [...(hooks.SessionStart ?? []), { matcher: "startup|resume|clear|compact", hooks: [command("session-start")] }];
  hooks.UserPromptSubmit = [...(hooks.UserPromptSubmit ?? []), { hooks: [command("prompt-submit")] }];
}

if (Object.keys(hooks).length > 0) settings.hooks = hooks;
else delete settings.hooks;
writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
