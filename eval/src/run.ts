// node eval/src/run.ts --batch NAME --model sonnet --arms all --tasks all --reps 3 --concurrency 6
// Appends one JSON record per (task, arm, rep) to eval/results/<batch>/records.jsonl; resumable.
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { MODELS, runAgent } from "./agent.ts";
import { type Arm, armPrompt, parseArms } from "./arms.ts";
import { loadTasks, matchPatterns, type Task } from "./tasks.ts";
import { measureDiff, prepareWorkspace, runCheck } from "./workspace.ts";

const { values: opt } = parseArgs({
  options: {
    batch: { type: "string" },
    model: { type: "string", default: "sonnet" },
    thinking: { type: "string", default: "medium" },
    arms: { type: "string", default: "all" },
    tasks: { type: "string", default: "all" },
    reps: { type: "string", default: "3" },
    concurrency: { type: "string", default: "6" },
    "max-minutes": { type: "string", default: "15" },
    "keep-workspaces": { type: "boolean", default: false },
  },
});
if (!opt.batch) throw new Error("--batch is required");
const model = MODELS[opt.model] ?? opt.model;
const resultsDir = join(import.meta.dirname, "..", "results", opt.batch);
const rawDir = join(import.meta.dirname, "..", "runs", opt.batch);
const workRoot = join("/tmp", "cockney-eval", opt.batch);
const recordsFile = join(resultsDir, "records.jsonl");
for (const dir of [resultsDir, rawDir, workRoot]) mkdirSync(dir, { recursive: true });

type Job = { task: Task; arm: Arm; rep: number; key: string };

function doneKeys(): Set<string> {
  if (!existsSync(recordsFile)) return new Set();
  const lines = readFileSync(recordsFile, "utf8").split("\n").filter(Boolean);
  const records: { key: string; error?: string }[] = lines.map((l) => JSON.parse(l));
  return new Set(records.filter((r) => !r.error).map((r) => r.key));
}

function planJobs(): Job[] {
  const arms = parseArms(opt.arms);
  const tasks = loadTasks(opt.tasks);
  const done = doneKeys();
  const jobs: Job[] = [];
  // Rep-major, arms interleaved per task, so drift over the batch hits every arm alike.
  for (let rep = 1; rep <= Number(opt.reps); rep++) {
    for (const task of tasks) {
      for (const arm of arms) {
        const key = `${opt.model}__${task.id}__${arm}__${rep}`;
        if (!done.has(key)) jobs.push({ task, arm, rep, key });
      }
    }
  }
  return jobs;
}

async function runJob(job: Job): Promise<void> {
  const workspace = join(workRoot, job.key);
  const scratch = `${workspace}.scratch`; // outside the workspace so it never shows up in the diff
  mkdirSync(scratch, { recursive: true });
  prepareWorkspace(job.task, workspace);
  const append = armPrompt(job.arm);
  const run = await runAgent({
    model, thinking: opt.thinking, prompt: job.task.prompt, cwd: workspace,
    appendSystemPrompt: append, scratchDir: scratch, maxMinutes: Number(opt["max-minutes"]),
  });
  writeFileSync(join(rawDir, `${job.key}.jsonl`), run.raw);
  const diff = measureDiff(workspace);
  const check = runCheck(job.task, workspace);
  const patterns = matchPatterns(job.task, run.reply);
  const { raw: _raw, ...agent } = run;
  const record = {
    key: job.key, batch: opt.batch, model: opt.model, modelId: model, thinking: opt.thinking,
    task: job.task.id, category: job.task.category, split: job.task.split, arm: job.arm, rep: job.rep,
    pass: check.pass && patterns.ok && !run.error, checkPass: check.pass, checkOutput: check.output,
    patternOk: patterns.ok, missingPatterns: patterns.missing, forbiddenPatterns: patterns.forbidden,
    ...agent, replyWords: run.reply.split(/\s+/).filter(Boolean).length,
    loc: { added: diff.added, deleted: diff.deleted, addedCode: diff.addedCode, files: diff.files },
    patch: diff.patch.slice(0, 40_000),
    appendSha: append === undefined ? null : createHash("sha256").update(append).digest("hex").slice(0, 12),
    finishedAt: new Date().toISOString(),
  };
  appendFileSync(recordsFile, `${JSON.stringify(record)}\n`);
  if (!opt["keep-workspaces"] && !run.error) rmSync(workspace, { recursive: true, force: true });
  rmSync(scratch, { recursive: true, force: true });
  const status = run.error ? `ERROR ${run.error.slice(0, 120)}` : record.pass ? "pass" : "FAIL";
  console.log(`${job.key}: ${status} out=${run.usage.output} loc=${diff.addedCode} ${Math.round(run.wallMs / 1000)}s`);
}

async function main(): Promise<void> {
  const jobs = planJobs();
  console.log(`${jobs.length} runs → ${recordsFile} (model ${model}, thinking ${opt.thinking})`);
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      if (!job) return;
      await runJob(job).catch((error: unknown) => console.error(`${job.key}: harness error`, error));
    }
  };
  await Promise.all(Array.from({ length: Number(opt.concurrency) }, worker));
}

await main();
