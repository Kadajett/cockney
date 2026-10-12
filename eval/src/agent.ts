// Runs one headless omp session and extracts usage from its `--mode json` event stream.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Subscription providers only. A model id resolving anywhere else (e.g. openrouter) aborts the run.
export const ALLOWED_PROVIDERS: Record<string, true> = { anthropic: true, "openai-codex": true };

export const MODELS: Record<string, string> = {
  haiku: "anthropic/claude-haiku-4-5",
  sonnet: "anthropic/claude-sonnet-5-5",
  opus: "anthropic/claude-opus-5-5",
  codex: "openai-codex/gpt-5.6-terra",
};

// Keep the run hermetic: no user context files, skills, rules or extensions; never openrouter.
const OVERLAY = `disabledProviders:
  - openrouter
disabledExtensions:
  - context-file:user:AGENTS.md
  - context-file:user:CLAUDE.md
  - context-file:project:AGENTS.md
  - context-file:project:CLAUDE.md
`;

export type Usage = { input: number; output: number; cacheRead: number; cacheWrite: number; cost: number };

export type AgentRun = {
  usage: Usage;
  turns: number;
  toolCalls: number;
  reply: string; // every visible assistant text block, in order
  finalReply: string;
  providers: string[];
  wallMs: number;
  exitCode: number | null;
  error?: string;
};

type Block = { type?: string; text?: string };
type AssistantMessage = { role?: string; provider?: string; usage?: Partial<Usage> & { cost?: { total?: number } }; content?: Block[] };

export function parseStream(jsonl: string): Omit<AgentRun, "wallMs" | "exitCode"> {
  const usage: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 };
  const texts: string[] = [];
  const providers = new Set<string>();
  let turns = 0;
  let toolCalls = 0;
  let finalReply = "";
  for (const line of jsonl.split("\n")) {
    if (!line.startsWith("{")) continue;
    const event: unknown = JSON.parse(line);
    if (!event || typeof event !== "object" || Reflect.get(event, "type") !== "message_end") continue;
    // Shape of omp's message_end event (packages/pi-agent-core AgentMessage).
    const message = Reflect.get(event, "message") as AssistantMessage | undefined;
    if (message?.role !== "assistant") continue;
    turns += 1;
    if (message.provider) providers.add(message.provider);
    usage.input += message.usage?.input ?? 0;
    usage.output += message.usage?.output ?? 0;
    usage.cacheRead += message.usage?.cacheRead ?? 0;
    usage.cacheWrite += message.usage?.cacheWrite ?? 0;
    usage.cost += message.usage?.cost?.total ?? 0;
    const blocks = message.content ?? [];
    toolCalls += blocks.filter((b) => b.type === "toolCall").length;
    const text = blocks
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (text === "") continue;
    texts.push(text);
    finalReply = text;
  }
  return { usage, turns, toolCalls, reply: texts.join("\n\n"), finalReply, providers: [...providers] };
}

export type AgentOptions = {
  model: string;
  thinking: string;
  prompt: string;
  cwd: string;
  appendSystemPrompt: string | undefined;
  scratchDir: string;
  maxMinutes: number;
};

export async function runAgent(opts: AgentOptions): Promise<AgentRun & { raw: string }> {
  const overlay = join(opts.scratchDir, "overlay.yml");
  writeFileSync(overlay, OVERLAY);
  const args = [
    "-p", "--mode", "json", "--model", opts.model, "--thinking", opts.thinking,
    "--no-skills", "--no-rules", "--no-extensions", "--no-lsp", "--no-session", "--no-title",
    "--auto-approve", "--tools", "read,bash,edit,write,grep,glob", "--config", overlay,
    "--max-time", `${opts.maxMinutes}m`, "--cwd", opts.cwd,
  ];
  if (opts.appendSystemPrompt !== undefined) {
    const file = join(opts.scratchDir, "append.md");
    writeFileSync(file, opts.appendSystemPrompt);
    args.push("--append-system-prompt", file);
  }
  args.push(opts.prompt);
  const started = Date.now();
  const child = spawn("omp", args, { cwd: opts.cwd, stdio: ["ignore", "pipe", "pipe"] });
  let raw = "";
  let stderr = "";
  child.stdout.on("data", (d: Buffer) => (raw += d.toString("utf8")));
  child.stderr.on("data", (d: Buffer) => (stderr += d.toString("utf8")));
  const exitCode = await new Promise<number | null>((resolve) => child.on("close", resolve));
  const parsed = parseStream(raw);
  const badProvider = parsed.providers.find((p) => !Object.hasOwn(ALLOWED_PROVIDERS, p));
  const error = badProvider
    ? `disallowed provider ${badProvider}`
    : exitCode !== 0 || parsed.turns === 0
      ? `omp exit ${exitCode}: ${stderr.slice(-800)}`
      : undefined;
  return { ...parsed, wallMs: Date.now() - started, exitCode, raw, ...(error ? { error } : {}) };
}
