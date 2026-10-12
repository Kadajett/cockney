// Each arm is the text appended to the agent's system prompt; `baseline` appends nothing.
// Third-party rulesets are vendored byte-for-byte in eval/arms/ (pinned commits in SOURCES.txt).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadRuleset } from "../../hooks/ruleset.ts";

export const ARMS = ["baseline", "concise", "caveman", "ponytail", "cockney-lite", "cockney-full", "cockney-guvnor"] as const;
export type Arm = (typeof ARMS)[number];

const ARMS_DIR = join(import.meta.dirname, "..", "arms");
const vendored = (file: string): string =>
  readFileSync(join(ARMS_DIR, file), "utf8").replace(/^---[\s\S]*?---\s*/, "");

// Ponytail's hook injects only the active level's table row; mirror that for `full`
// (hooks/ponytail-instructions.js filterSkillBodyForMode).
function ponytailFull(): string {
  const body = vendored("ponytail.SKILL.md")
    .split("\n")
    .filter((line) => {
      const label = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|/)?.[1]?.trim();
      return label === undefined || !["lite", "full", "ultra"].includes(label) || label === "full";
    });
  return `PONYTAIL MODE ACTIVE — level: full\n\n${body.join("\n")}`;
}

export function armPrompt(arm: Arm): string | undefined {
  switch (arm) {
    case "baseline":
      return undefined;
    case "concise":
      // The control caveman's own evals use: modern models already know "be concise".
      return "Answer concisely.";
    case "caveman":
      return vendored("caveman.SKILL.md");
    case "ponytail":
      return ponytailFull();
    case "cockney-lite":
      return loadRuleset("lite");
    case "cockney-full":
      return loadRuleset("full");
    case "cockney-guvnor":
      return loadRuleset("guvnor");
  }
}

const isArm = (value: string): value is Arm => (ARMS as readonly string[]).includes(value);

export function parseArms(spec: string): Arm[] {
  if (spec === "all") return [...ARMS];
  const names = spec.split(",").map((s) => s.trim());
  const unknown = names.filter((name) => !isArm(name));
  if (unknown.length > 0) throw new Error(`unknown arms: ${unknown.join(", ")}`);
  return names.filter(isArm);
}
