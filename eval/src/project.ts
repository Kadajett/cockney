// node eval/src/project.ts --batch NAME --model sonnet [--arms all] [--projects all|id,id] [--reps 3]
// Multi-step builds: every step is one more user prompt in the same continuing omp session.
// After each step the workspace is copied (before committing the step, so HEAD = end of the
// previous step), hidden/step<N>/ is overlaid, and the step's check runs on the copy.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { MODELS, runAgent } from "./agent.ts";
import { type Arm, armPrompt, parseArms } from "./arms.ts";
import { matchPatterns, type Patterns } from "./tasks.ts";
import { commitAll, measureDiff, prepareWorkspace, runCheck } from "./workspace.ts";

type Step = Patterns & { kind: "build" | "explain" | "delete"; prompt: string; check: string };
type Project = { id: string; lang: string; steps: Step[]; dir: string };

const PROJECTS_DIR = join(import.meta.dirname, "..", "projects");
// Slang from SKILL.md; counted per step to see whether the voice survives a long session.
const SLANG = /\b(guv|guvnor|blimey|butcher'?s|old pony|dog'?s dinner|bang to rights|me old china|sorted|bodge[ds]?|knackered|oi|innit|gaff)\b/gi;

const { values: opt } = parseArgs({
	options: {
		batch: { type: "string" },
		model: { type: "string", default: "sonnet" },
		thinking: { type: "string", default: "medium" },
		arms: { type: "string", default: "all" },
		projects: { type: "string", default: "all" },
		reps: { type: "string", default: "3" },
		concurrency: { type: "string", default: "4" },
	},
});
if (!opt.batch) throw new Error("--batch is required");
const model = MODELS[opt.model] ?? opt.model;
const resultsDir = join(import.meta.dirname, "..", "results", opt.batch);
const workRoot = join("/tmp", "cockney-eval", opt.batch);
const out = join(resultsDir, "projects.jsonl");
mkdirSync(resultsDir, { recursive: true });

function loadProjects(): Project[] {
	const ids = readdirSync(PROJECTS_DIR).filter((id) => existsSync(join(PROJECTS_DIR, id, "project.json")));
	const wanted = opt.projects === "all" ? ids : opt.projects.split(",");
	// project.json is first-party and versioned with the harness.
	return wanted.map((id) => ({ ...JSON.parse(readFileSync(join(PROJECTS_DIR, id, "project.json"), "utf8")), dir: join(PROJECTS_DIR, id) }));
}

async function runStep(project: Project, arm: Arm, i: number, ws: string, scratch: string) {
	const step = project.steps[i] as Step;
	const run = await runAgent({
		model, thinking: opt.thinking, prompt: step.prompt, cwd: ws, appendSystemPrompt: armPrompt(arm),
		scratchDir: scratch, maxMinutes: 15, session: { dir: join(scratch, "session"), resume: i > 0 },
	});
	const diff = measureDiff(ws);
	const checkDir = `${ws}.check${i + 1}`;
	rmSync(checkDir, { recursive: true, force: true });
	cpSync(ws, checkDir, { recursive: true });
	const check = runCheck(join(project.dir, "hidden", `step${i + 1}`), step.check, checkDir);
	rmSync(checkDir, { recursive: true, force: true });
	commitAll(ws, `step ${i + 1}`);
	const patterns = matchPatterns(step, run.reply);
	return {
		step: i + 1, kind: step.kind, pass: check.pass && patterns.ok && !run.error, checkPass: check.pass,
		checkOutput: check.output.slice(-1500), missingPatterns: patterns.missing, error: run.error,
		usage: run.usage, turns: run.turns, wallMs: run.wallMs, reply: run.reply, providers: run.providers,
		replyWords: run.reply.split(/\s+/).filter(Boolean).length, slangHits: run.reply.match(SLANG)?.length ?? 0,
		loc: { added: diff.added, deleted: diff.deleted, addedCode: diff.addedCode },
	};
}

async function runProject(project: Project, arm: Arm, rep: number): Promise<void> {
	const key = `${opt.model}__${project.id}__${arm}__${rep}`;
	const ws = join(workRoot, key);
	const scratch = `${ws}.scratch`;
	rmSync(scratch, { recursive: true, force: true });
	mkdirSync(scratch, { recursive: true });
	prepareWorkspace(join(project.dir, "repo"), ws);
	const steps = [];
	for (let i = 0; i < project.steps.length; i++) steps.push(await runStep(project, arm, i, ws, scratch));
	const final = measureDiff(ws, "main~" + project.steps.length);
	const total = (pick: (s: (typeof steps)[number]) => number) => steps.reduce((n, s) => n + pick(s), 0);
	const record = {
		key, batch: opt.batch, model: opt.model, modelId: model, project: project.id, arm, rep,
		stepsPassed: steps.filter((s) => s.pass).length, steps: steps.length,
		output: total((s) => s.usage.output), cost: total((s) => s.usage.cost), wallMs: total((s) => s.wallMs),
		finalAddedCode: final.addedCode, error: steps.find((s) => s.error)?.error, perStep: steps,
		finishedAt: new Date().toISOString(),
	};
	appendFileSync(out, `${JSON.stringify(record)}\n`);
	rmSync(ws, { recursive: true, force: true });
	rmSync(scratch, { recursive: true, force: true });
	console.log(`${key}: ${record.stepsPassed}/${record.steps} out=${record.output} loc=${record.finalAddedCode}`);
}

const done = new Set(
	existsSync(out)
		? readFileSync(out, "utf8").split("\n").filter(Boolean).map((l) => String(Reflect.get(JSON.parse(l), "key")))
		: [],
);
const jobs = loadProjects()
	.flatMap((project) =>
		Array.from({ length: Number(opt.reps) }, (_, r) => r + 1).flatMap((rep) =>
			parseArms(opt.arms).map((arm) => ({ project, arm, rep })),
		),
	)
	.filter((j) => !done.has(`${opt.model}__${j.project.id}__${j.arm}__${j.rep}`));
console.log(`${jobs.length} project runs → ${out}`);
let next = 0;
const worker = async () => {
	while (next < jobs.length) {
		const job = jobs[next++];
		if (!job) return;
		await runProject(job.project, job.arm, job.rep).catch((e: unknown) => console.error(`${job.project.id}/${job.arm}/${job.rep}: harness error`, e));
	}
};
await Promise.all(Array.from({ length: Number(opt.concurrency) }, worker));
