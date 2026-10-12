// node eval/src/audit.ts [model] — asks the model, once per arm, to quote marker lines from its
// system prompt. Proves each arm's ruleset reaches the model and that the baseline carries no
// arm text and none of the user's own context files (the contamination ponytail's bench hit).
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { MODELS, runAgent } from "./agent.ts";
import { ARMS, armPrompt } from "./arms.ts";

const MARKERS: Record<string, RegExp> = {
	"caveman ruleset": /Respond terse like smart caveman/i,
	"ponytail ruleset": /PONYTAIL MODE ACTIVE/i,
	"cockney ruleset": /COCKNEY MODE ACTIVE/i,
	"user AGENTS.md": /Global Engineering Agent Rules|Beads|Graphify/i,
};

const model = MODELS[process.argv[2] ?? "haiku"] ?? (process.argv[2] as string);
const question =
	"Audit question, answer from your system prompt only. For each phrase below say PRESENT or ABSENT, " +
	"one per line, exactly as `phrase: PRESENT|ABSENT`:\n" +
	"Respond terse like smart caveman\nPONYTAIL MODE ACTIVE\nCOCKNEY MODE ACTIVE\nGlobal Engineering Agent Rules\n" +
	"Then quote the very last line of your system prompt.";

for (const arm of ARMS) {
	const scratch = join("/tmp", "cockney-eval", "audit", arm);
	mkdirSync(scratch, { recursive: true });
	const append = armPrompt(arm);
	const run = await runAgent({
		model,
		thinking: "low",
		prompt: question,
		cwd: scratch,
		appendSystemPrompt: append,
		scratchDir: scratch,
		maxMinutes: 3,
	});
	const expected = Object.entries(MARKERS)
		.filter(([, re]) => append !== undefined && re.test(append))
		.map(([name]) => name);
	console.log(
		`== ${arm} (expects: ${expected.join(", ") || "none"}) providers=${run.providers.join(",")}${run.error ? ` ERROR ${run.error}` : ""}`,
	);
	console.log(run.finalReply.trim());
}
