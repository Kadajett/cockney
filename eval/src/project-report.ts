// node eval/src/project-report.ts --batch NAME[,NAME...] [--out FILE]
// Per model × project × arm: steps passed, whole-session output tokens, cost, time, final code
// size, and slang per step (does the voice survive a long session?). Means over reps, with the
// change against baseline's mean. Only two projects, so no per-project significance tests.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { ARMS } from "./arms.ts";
import { RESULTS_DIR } from "./records.ts";
import { mean } from "./stats.ts";

type StepRecord = { pass: boolean; slangHits: number; usage: { output: number } };
type ProjectRecord = {
	model: string;
	project: string;
	arm: string;
	stepsPassed: number;
	steps: number;
	output: number;
	cost: number;
	wallMs: number;
	finalAddedCode: number;
	error?: string;
	perStep: StepRecord[];
};

const { values: opt } = parseArgs({ options: { batch: { type: "string" }, out: { type: "string" } } });
if (!opt.batch) throw new Error("--batch is required");
const records = opt.batch.split(",").flatMap((b) => {
	const file = join(RESULTS_DIR, b, "projects.jsonl");
	if (!existsSync(file)) return [];
	// First-party file written by project.ts.
	return readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l) as ProjectRecord);
}).filter((r) => !r.error);

const pct = (a: number, b: number) => (b === 0 ? "n/a" : `${a >= b ? "+" : ""}${((a / b - 1) * 100).toFixed(1)}%`);

function table(model: string, project: string, rs: ProjectRecord[]): string[] {
	const base = rs.filter((r) => r.arm === "baseline");
	const b = (f: (r: ProjectRecord) => number) => mean(base.map(f));
	const steps = rs[0]?.steps ?? 0;
	const lines = [
		`#### ${model} · ${project} (${steps} steps)`,
		"",
		"| arm | runs | steps passed | per-step pass | output tokens | cost $ | time s | final code lines | slang/step |",
		"|---|---|---|---|---|---|---|---|---|",
	];
	for (const arm of ARMS) {
		const mine = rs.filter((r) => r.arm === arm);
		if (mine.length === 0) continue;
		const m = (f: (r: ProjectRecord) => number) => mean(mine.map(f));
		const perStep = Array.from({ length: steps }, (_, i) => mine.filter((r) => r.perStep[i]?.pass).length).join(" ");
		const slang = Array.from({ length: steps }, (_, i) => mean(mine.map((r) => r.perStep[i]?.slangHits ?? 0)).toFixed(1)).join(" ");
		const cell = (f: (r: ProjectRecord) => number, digits: number) =>
			`${m(f).toFixed(digits)}${arm === "baseline" ? "" : ` (${pct(m(f), b(f))})`}`;
		lines.push(
			`| ${arm} | ${mine.length} | ${m((r) => r.stepsPassed).toFixed(2)}/${steps} | ${perStep} | ${cell((r) => r.output, 0)} | ${cell((r) => r.cost, 3)} | ${cell((r) => r.wallMs / 1000, 0)} | ${cell((r) => r.finalAddedCode, 0)} | ${slang} |`,
		);
	}
	return [...lines, ""];
}

const lines = [`## Multi-step projects: ${opt.batch}`, ""];
for (const [model, byModel] of Map.groupBy(records, (r) => r.model)) {
	for (const [project, rs] of Map.groupBy(byModel, (r) => r.project)) lines.push(...table(model, project, rs));
}
lines.push(
	"Per-step pass: runs passing each step's hidden check, step 1 first. Slang/step: mean slang words per step reply, step 1 first. Changes are against baseline's mean.",
);
const report = lines.join("\n");
if (opt.out) writeFileSync(opt.out, `${report}\n`);
console.log(report);
