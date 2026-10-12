// Claude Code hook: `node claude.ts session-start|prompt-submit`, hook JSON on stdin.
// SessionStart injects the ruleset for the session's level; UserPromptSubmit tracks
// `/cockney <level>` and "speak proper", and keeps a one-line reminder in every turn.
// Fails open: any error means no injection, never a blocked prompt.
import { type Mode, loadRuleset, parseModeCommand, readMode, writeMode } from "./ruleset.ts";

function field(input: unknown, key: string): string | undefined {
  if (!input || typeof input !== "object") return undefined;
  const value: unknown = Reflect.get(input, key);
  return typeof value === "string" ? value : undefined;
}

function emit(hookEventName: string, additionalContext: string): void {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext } }));
}

function sessionStart(sessionId: string): void {
  const mode = readMode(sessionId);
  if (mode !== "off") emit("SessionStart", loadRuleset(mode));
}

function describe(mode: Mode): string {
  if (mode === "off") return "COCKNEY MODE OFF — speak plain English from now on.";
  return `COCKNEY MODE CHANGED — level: ${mode}\n\n${loadRuleset(mode)}`;
}

function promptSubmit(sessionId: string, prompt: string): void {
  const command = parseModeCommand(prompt);
  const current = readMode(sessionId);
  if (command === "status") {
    emit("UserPromptSubmit", `Report in one line: cockney mode is "${current}".`);
    return;
  }
  if (command !== undefined) {
    writeMode(sessionId, command);
    emit("UserPromptSubmit", describe(command));
    return;
  }
  if (current !== "off") emit("UserPromptSubmit", `COCKNEY MODE: ${current} (rules in session context).`);
}

async function main(): Promise<void> {
  let raw = "";
  for await (const chunk of process.stdin) raw += String(chunk);
  const input: unknown = JSON.parse(raw.replace(/^\uFEFF/, "") || "{}");
  const sessionId = field(input, "session_id") ?? "default";
  if (process.argv[2] === "session-start") sessionStart(sessionId);
  if (process.argv[2] === "prompt-submit") promptSubmit(sessionId, field(input, "prompt") ?? "");
}

main().catch((error: unknown) => {
  process.stderr.write(`cockney hook skipped: ${error instanceof Error ? error.message : String(error)}\n`);
});
