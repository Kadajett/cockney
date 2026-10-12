// node eval/src/report.ts --batch NAME[,NAME...] [--ref baseline] [--split all|dev|test] [--out FILE]
// Paired per-task comparison of every arm against a reference arm. Each task's value is the mean
// over its reps; tests run across tasks (exact Wilcoxon / sign test), CIs bootstrap over tasks.
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { ARMS } from "./arms.ts";
import { type Judgment, loadJudgments, loadRecords, type RunRecord } from "./records.ts";
import { bootstrapMedianCI, mean, median, signTest, wilcoxon } from "./stats.ts";

const { values: opt } = parseArgs({
	options: {
		batch: { type: "string" },
		ref: { type: "string", default: "baseline" },
		split: { type: "string", default: "all" },
		out: { type: "string" },
	},
});
if (!opt.batch) throw new Error("--batch is required");
const batches = opt.batch.split(",");
const records = loadRecords(batches).filter((r) => opt.split === "all" || r.split === opt.split);
const judgments = loadJudgments(batches);

type Metric = (r: RunRecord) => number;
const METRICS = {
	output: (r) => r.usage.output,
	words: (r) => r.replyWords,
	cost: (r) => r.usage.cost,
	time: (r) => r.wallMs / 1000,
} satisfies Record<string, Metric>;

const fmtPct = (x: number) =>
	Number.isFinite(x) ? `${x > 0 ? "+" : ""}${(x * 100).toFixed(1)}%` : "n/a";
const fmtP = (p: number) => (p < 0.001 ? "<0.001" : p.toFixed(3));
const byTask = (rs: RunRecord[]) => Map.groupBy(rs, (r) => r.task);

function perTaskMeans(arm: string, rs: RunRecord[], metric: Metric): Map<string, number> {
	const means = new Map<string, number>();
	for (const [task, group] of byTask(rs.filter((r) => r.arm === arm)))
		means.set(task, mean(group.map(metric)));
	return means;
}

// Median per-task ratio (arm / ref) − 1, its bootstrap CI, and Wilcoxon on log ratios.
function ratioCell(arm: string, ref: string, rs: RunRecord[], metric: Metric): string {
	const a = perTaskMeans(arm, rs, metric);
	if (arm === ref) return `median ${median([...a.values()]).toPrecision(3)}`;
	const b = perTaskMeans(ref, rs, metric);
	const logs = [...a]
		.filter(([t, v]) => (b.get(t) ?? 0) > 0 && v > 0)
		.map(([t, v]) => Math.log(v / (b.get(t) ?? 1)));
	if (logs.length === 0) return "n/a";
	const [lo, hi] = bootstrapMedianCI(logs);
	const { p } = wilcoxon(logs);
	return `${fmtPct(Math.exp(median(logs)) - 1)} [${fmtPct(Math.exp(lo) - 1)}, ${fmtPct(Math.exp(hi) - 1)}] p=${fmtP(p)}`;
}

// Code lines: total change (zeros make per-task ratios meaningless) plus Wilcoxon on differences.
function locCell(arm: string, ref: string, rs: RunRecord[]): string {
	const a = perTaskMeans(arm, rs, (r) => r.loc.addedCode);
	const b = perTaskMeans(ref, rs, (r) => r.loc.addedCode);
	const tasks = [...a.keys()].filter((t) => b.has(t));
	const sumA = tasks.reduce((s, t) => s + (a.get(t) ?? 0), 0);
	const sumB = tasks.reduce((s, t) => s + (b.get(t) ?? 0), 0);
	const { p } = wilcoxon(tasks.map((t) => (a.get(t) ?? 0) - (b.get(t) ?? 0)));
	return `${sumA.toFixed(0)} vs ${sumB.toFixed(0)} (${fmtPct(sumA / sumB - 1)}) p=${fmtP(p)}`;
}

function passCell(arm: string, ref: string, rs: RunRecord[]): string {
	const mine = rs.filter((r) => r.arm === arm);
	const a = perTaskMeans(arm, rs, (r) => Number(r.pass));
	const b = perTaskMeans(ref, rs, (r) => Number(r.pass));
	const diffs = [...a].filter(([t]) => b.has(t)).map(([t, v]) => v - (b.get(t) ?? 0));
	const wins = diffs.filter((d) => d > 0).length;
	const losses = diffs.filter((d) => d < 0).length;
	const passed = mine.filter((r) => r.pass).length;
	const p = arm === ref ? "" : ` (${wins}↑ ${losses}↓ p=${fmtP(signTest(wins, losses))})`;
	return `${passed}/${mine.length} ${fmtPct(passed / mine.length).replace("+", "")}${p}`;
}

function judgeCell(arm: string, ref: string, model: string): string {
	const js = judgments.filter((j) => j.group.startsWith(`${model}__`));
	const mine = js.filter((j) => j.arm === arm);
	if (mine.length === 0) return "— | — | — | —";
	const refByGroup = new Map(js.filter((j) => j.arm === ref).map((j) => [j.group, j.overall]));
	const diffs = mine
		.filter((j) => refByGroup.has(j.group))
		.map((j) => j.overall - (refByGroup.get(j.group) ?? 0));
	const best = mine.filter((j) => j.best).length;
	const p = arm === ref ? "" : ` p=${fmtP(wilcoxon(diffs).p)}`;
	const avg = (k: keyof Judgment) => mean(mine.map((j) => Number(j[k]))).toFixed(2);
	return `${avg("overall")}${p} | ${avg("clarity")} | ${avg("accuracy")} | ${best}/${mine.length}`;
}

function safetyCell(arm: string, model: string): string {
	const mine = judgments.filter((j) => j.group.startsWith(`${model}__`) && j.arm === arm);
	if (mine.length === 0) return "—";
	return `${mine.filter((j) => j.safety_plain === "no").length} / ${mine.filter((j) => j.disrespect).length}`;
}

function modelTable(model: string, rs: RunRecord[], ref: string): string[] {
	const arms = ARMS.filter((a) => rs.some((r) => r.arm === a));
	const header = [
		`### ${model} — vs \`${ref}\`, ${byTask(rs).size} tasks, ${rs.length} runs`,
		"",
		"| arm | pass | output tokens | reply words | code lines added | cost | time | judge overall | clarity | accuracy | judge best | unsafe-warn / disrespect |",
		"|---|---|---|---|---|---|---|---|---|---|---|---|",
	];
	const rows = arms.map((arm) =>
		[
			arm,
			passCell(arm, ref, rs),
			ratioCell(arm, ref, rs, METRICS.output),
			ratioCell(arm, ref, rs, METRICS.words),
			locCell(arm, ref, rs),
			ratioCell(arm, ref, rs, METRICS.cost),
			ratioCell(arm, ref, rs, METRICS.time),
			judgeCell(arm, ref, model),
			safetyCell(arm, model),
		].join(" | "),
	);
	return [...header, ...rows.map((r) => `| ${r} |`), ""];
}

function categoryTable(model: string, rs: RunRecord[]): string[] {
	const arms = ARMS.filter((a) => rs.some((r) => r.arm === a));
	const cats = [...new Set(rs.map((r) => r.category))].sort();
	const cell = (arm: string, cat: string) => {
		const g = rs.filter((r) => r.arm === arm && r.category === cat);
		return `${g.filter((r) => r.pass).length}/${g.length} · ${mean(g.map((r) => r.loc.addedCode)).toFixed(0)}L · ${mean(g.map((r) => r.usage.output)).toFixed(0)}t`;
	};
	return [
		`#### ${model} by category (pass · mean code lines · mean output tokens)`,
		"",
		`| arm | ${cats.join(" | ")} |`,
		`|---|${cats.map(() => "---").join("|")}|`,
		...arms.map((arm) => `| ${arm} | ${cats.map((c) => cell(arm, c)).join(" | ")} |`),
		"",
	];
}

const lines = [`## Results: ${batches.join(", ")} (split: ${opt.split})`, ""];
for (const [model, rs] of Map.groupBy(records, (r) => r.model)) {
	lines.push(...modelTable(model, rs, opt.ref), ...categoryTable(model, rs));
}
lines.push(
	"Ratios are the median over tasks of (arm mean ÷ reference mean) − 1, with a bootstrap 95% CI over tasks and an exact Wilcoxon signed-rank p on log ratios. Pass: sign test over tasks. Code lines: non-blank, non-comment added lines left in the workspace. Judge overall is 1-10 (blinded, shuffled letters); its p is Wilcoxon on per-reply differences from the reference arm.",
);
const report = lines.join("\n");
if (opt.out) writeFileSync(opt.out, `${report}\n`);
console.log(report);
