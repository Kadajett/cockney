import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Usage } from "./agent.ts";

export const RESULTS_DIR = join(import.meta.dirname, "..", "results");

// One line of results/<batch>/records.jsonl, as written by run.ts.
export type RunRecord = {
	key: string;
	batch: string;
	model: string;
	task: string;
	category: string;
	split: string;
	arm: string;
	rep: number;
	pass: boolean;
	checkPass: boolean;
	patternOk: boolean;
	usage: Usage;
	turns: number;
	toolCalls: number;
	wallMs: number;
	reply: string;
	finalReply: string;
	replyWords: number;
	loc: { added: number; deleted: number; addedCode: number; files: number };
	patch: string;
	error?: string;
};

export type Judgment = {
	group: string; // model__task__rep
	arm: string;
	label: string;
	clarity: number;
	accuracy: number;
	completeness: number;
	concision: number;
	overall: number;
	safety_plain: "yes" | "no" | "n/a";
	disrespect: boolean;
	best: boolean;
};

function readJsonl<T>(file: string): T[] {
	if (!existsSync(file)) return [];
	return readFileSync(file, "utf8")
		.split("\n")
		.filter(Boolean)
		.map((line) => JSON.parse(line) as T); // first-party files written by this harness
}

// Latest successful record per key wins (reruns append; errors are ignored).
export function loadRecords(batches: readonly string[]): RunRecord[] {
	const byKey = new Map<string, RunRecord>();
	for (const batch of batches) {
		for (const r of readJsonl<RunRecord>(join(RESULTS_DIR, batch, "records.jsonl"))) {
			if (!r.error) byKey.set(r.key, r);
		}
	}
	return [...byKey.values()];
}

export const loadJudgments = (batches: readonly string[]): Judgment[] =>
	batches.flatMap((b) => readJsonl<Judgment>(join(RESULTS_DIR, b, "judgments.jsonl")));
