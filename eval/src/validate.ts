// node eval/src/validate.ts — proves every task's check fails on the untouched repo
// (explain tasks excepted: they only verify nothing was edited) and passes with solution/.
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadTasks, matchPatterns } from "./tasks.ts";
import { applySolution, prepareWorkspace, runCheck } from "./workspace.ts";

const root = join("/tmp", "cockney-eval", "validate");
let failures = 0;

for (const task of loadTasks(process.argv[2] ?? "all")) {
	const before = join(root, `${task.id}-before`);
	prepareWorkspace(task, before);
	const untouched = runCheck(task, before);
	const after = join(root, `${task.id}-after`);
	prepareWorkspace(task, after);
	applySolution(task, after);
	const solved = runCheck(task, after);
	const answerFile = join(task.dir, "solution", "ANSWER.md");
	const answer = existsSync(answerFile) ? readFileSync(answerFile, "utf8") : "";
	const patterns = matchPatterns(task, answer);
	const needsPatterns = (task.answer_patterns ?? []).length > 0;
	const problems = [
		task.category !== "explain" && untouched.pass ? "check passes on untouched repo" : "",
		task.category === "explain" && !untouched.pass ? "explain check fails on untouched repo" : "",
		solved.pass ? "" : `solution fails check:\n${solved.output}`,
		needsPatterns && !patterns.ok ? `ANSWER.md misses ${patterns.missing.join(", ")}` : "",
	].filter(Boolean);
	failures += problems.length > 0 ? 1 : 0;
	console.log(
		`${problems.length === 0 ? "ok  " : "BAD "} ${task.id} (${task.category}/${task.split})`,
	);
	for (const problem of problems) console.log(`     ${problem}`);
	rmSync(before, { recursive: true, force: true });
	rmSync(after, { recursive: true, force: true });
}

process.exitCode = failures === 0 ? 0 : 1;
