import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const TASKS_DIR = join(import.meta.dirname, "..", "tasks");

export type Category = "bugfix" | "feature" | "refactor" | "explain" | "pushback" | "safety";

export type Task = {
  id: string;
  category: Category;
  split: "dev" | "test";
  prompt: string;
  check: string;
  answer_patterns?: string[];
  forbid_patterns?: string[];
  notes?: string;
  dir: string;
};

function loadTask(dir: string): Task {
  const raw: unknown = JSON.parse(readFileSync(join(dir, "task.json"), "utf8"));
  if (!raw || typeof raw !== "object") throw new Error(`${dir}/task.json: not an object`);
  for (const key of ["id", "category", "split", "prompt", "check"]) {
    if (typeof Reflect.get(raw, key) !== "string") throw new Error(`${dir}/task.json: missing string "${key}"`);
  }
  // Fields checked above; task.json is first-party and versioned with the harness.
  return { ...(raw as Omit<Task, "dir">), dir };
}

export function loadTasks(filter = "all"): Task[] {
  const ids = readdirSync(TASKS_DIR)
    .filter((id) => existsSync(join(TASKS_DIR, id, "task.json")))
    .sort();
  const tasks = ids.map((id) => loadTask(join(TASKS_DIR, id)));
  if (filter === "all") return tasks;
  if (filter === "dev" || filter === "test") return tasks.filter((t) => t.split === filter);
  const wanted = filter.split(",");
  const missing = wanted.filter((id) => !ids.includes(id));
  if (missing.length > 0) throw new Error(`unknown tasks: ${missing.join(", ")}`);
  return tasks.filter((t) => wanted.includes(t.id));
}

export function matchPatterns(task: Task, reply: string): { ok: boolean; missing: string[]; forbidden: string[] } {
  const test = (p: string) => new RegExp(p, "i").test(reply);
  const missing = (task.answer_patterns ?? []).filter((p) => !test(p));
  const forbidden = (task.forbid_patterns ?? []).filter(test);
  return { ok: missing.length === 0 && forbidden.length === 0, missing, forbidden };
}
