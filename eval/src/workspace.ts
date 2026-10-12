import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Task } from "./tasks.ts";

const git = (cwd: string, ...args: string[]): string =>
	execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

export function prepareWorkspace(task: Task, dest: string): void {
	rmSync(dest, { recursive: true, force: true });
	mkdirSync(dest, { recursive: true });
	cpSync(join(task.dir, "repo"), dest, { recursive: true });
	git(dest, "init", "-q", "-b", "main");
	writeFileSync(join(dest, ".git", "info", "exclude"), "node_modules/\n__pycache__/\n*.pyc\n");
	git(dest, "-c", "user.name=eval", "-c", "user.email=eval@localhost", "add", "-A");
	git(
		dest,
		"-c",
		"user.name=eval",
		"-c",
		"user.email=eval@localhost",
		"commit",
		"-q",
		"-m",
		"initial",
	);
}

export type DiffStats = {
	added: number;
	deleted: number;
	addedCode: number;
	files: number;
	patch: string;
};

const isComment = (line: string): boolean => /^(#|\/\/|\/\*|\*|<!--)/.test(line);

// Lines the agent left behind relative to the initial commit, counted the way ponytail's
// benchmarks/loc.js does: added lines that are neither blank nor comments.
export function measureDiff(dest: string): DiffStats {
	git(dest, "add", "-A");
	const patch = git(dest, "diff", "--cached", "-U0", "--no-color", "HEAD");
	const numstat = git(dest, "diff", "--cached", "--numstat", "HEAD").trim();
	const rows = numstat === "" ? [] : numstat.split("\n").map((row) => row.split("\t"));
	const text = rows.filter(([a]) => a !== "-");
	const sum = (i: number) => text.reduce((n, row) => n + Number(row[i]), 0);
	const addedCode = patch
		.split("\n")
		.filter((l) => l.startsWith("+") && !l.startsWith("+++"))
		.map((l) => l.slice(1).trim())
		.filter((l) => l !== "" && !isComment(l)).length;
	return { added: sum(0), deleted: sum(1), addedCode, files: rows.length, patch };
}

export type CheckResult = { pass: boolean; exitCode: number | null; output: string };

export function runCheck(task: Task, dest: string): CheckResult {
	const hidden = join(task.dir, "hidden");
	if (existsSync(hidden)) cpSync(hidden, dest, { recursive: true });
	const result = spawnSync("bash", ["-c", task.check], {
		cwd: dest,
		encoding: "utf8",
		timeout: 120_000,
	});
	const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.slice(-4000);
	return { pass: result.status === 0, exitCode: result.status, output };
}

// Overlay solution/ (honouring solution/.delete) — used by validate.ts to prove each check can pass.
export function applySolution(task: Task, dest: string): void {
	const solution = join(task.dir, "solution");
	cpSync(solution, dest, { recursive: true });
	const deleteList = join(solution, ".delete");
	if (!existsSync(deleteList)) return;
	for (const rel of readFileSync(deleteList, "utf8").split("\n").filter(Boolean)) {
		rmSync(join(dest, rel.trim()), { recursive: true, force: true });
	}
	rmSync(join(dest, ".delete"), { force: true });
}
