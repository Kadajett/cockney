// Shared by the Claude Code hooks, the omp extension, the Codex snippet and the eval harness,
// so the injected text is always generated from SKILL.md and never drifts from it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const LEVELS = ["lite", "full", "guvnor"] as const;
export type Level = (typeof LEVELS)[number];
export type Mode = Level | "off";

const HERE = dirname(fileURLToPath(import.meta.url));
const OFF_PHRASES: Record<string, true> = {
	"speak proper": true,
	"stop cockney": true,
	"normal mode": true,
	"cockney off": true,
};

export function isLevel(value: string): value is Level {
	return (LEVELS as readonly string[]).includes(value);
}

export function findSkillFile(): string {
	const candidates = [
		process.env["COCKNEY_SKILL_FILE"],
		join(HERE, "SKILL.md"),
		join(HERE, "..", "SKILL.md"),
		join(HERE, "..", "skills", "cockney", "SKILL.md"),
		// omp install: ~/.omp/agent/extensions/cockney/ → ~/.omp/agent/skills/cockney/SKILL.md
		join(HERE, "..", "..", "skills", "cockney", "SKILL.md"),
	];
	const found = candidates.find((path) => path !== undefined && existsSync(path));
	if (!found) throw new Error(`cockney: SKILL.md not found (looked in ${candidates.join(", ")})`);
	return found;
}

export function buildRuleset(skillText: string, level: Level): string {
	const body = skillText.replace(/^---[\s\S]*?---\s*/, "");
	// Keep only this level's level-tagged lines: table rows `| **lite** |` and examples `- lite: "`.
	const kept = body.split(/\r?\n/).filter((line) => {
		const tag = line.match(/^\|\s*\*\*(\w+)\*\*\s*\|/)?.[1] ?? line.match(/^-\s*(\w+):\s*"/)?.[1];
		return tag === undefined || !isLevel(tag) || tag === level;
	});
	return `COCKNEY MODE ACTIVE — level: ${level}\n\n${kept.join("\n").trim()}\n`;
}

export function loadRuleset(level: Level): string {
	return buildRuleset(readFileSync(findSkillFile(), "utf8"), level);
}

// A prompt is a mode command only when the whole message is the command, so a sentence that
// merely mentions "normal mode" never switches the bit off mid-task.
export function parseModeCommand(prompt: string): Mode | "status" | undefined {
	const text = prompt
		.trim()
		.toLowerCase()
		.replace(/[.!]+$/, "");
	if (Object.hasOwn(OFF_PHRASES, text)) return "off";
	const match = text.match(/^[/$@](?:cockney:)?cockney(?:\s+(\w+))?$/);
	if (!match) return undefined;
	const arg = match[1];
	if (arg === undefined) return "full";
	if (arg === "off") return "off";
	if (arg === "status") return "status";
	return isLevel(arg) ? arg : undefined;
}

export function defaultMode(): Mode {
	const fromEnv = process.env["COCKNEY_DEFAULT_MODE"]?.trim().toLowerCase();
	if (fromEnv === "off" || (fromEnv && isLevel(fromEnv))) return fromEnv;
	return "full";
}

function stateFile(sessionId: string): string {
	const root =
		process.env["COCKNEY_STATE_DIR"] ?? join(homedir(), ".config", "cockney", "sessions");
	return join(root, sessionId.replace(/[^\w.-]/g, "_"));
}

export function readMode(sessionId: string): Mode {
	const path = stateFile(sessionId);
	if (!existsSync(path)) return defaultMode();
	const saved = readFileSync(path, "utf8").trim();
	return saved === "off" || isLevel(saved) ? saved : defaultMode();
}

export function writeMode(sessionId: string, mode: Mode): void {
	const path = stateFile(sessionId);
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, mode);
}

// `node hooks/ruleset.ts [level]` prints the ruleset (used by install.sh for the Codex snippet).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	const level = process.argv[2] ?? "full";
	if (!isLevel(level)) throw new Error(`cockney: unknown level "${level}"`);
	process.stdout.write(loadRuleset(level));
}
