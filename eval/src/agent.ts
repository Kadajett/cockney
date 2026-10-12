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
	"codex-6": "openai-codex/gpt-6-luna",
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

export type Usage = {
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
	cost: number;
};

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
type AssistantMessage = {
	role?: string;
	provider?: string;
	usage?: Partial<Usage> & { cost?: { total?: number } };
	content?: Block[];
};

// Assistant messages from omp's `--mode json` stream (message_end events; packages/pi-agent-core AgentMessage).
function assistantMessages(jsonl: string): AssistantMessage[] {
	return jsonl
		.split("\n")
		.filter((line) => line.startsWith("{"))
		.map((line): unknown => JSON.parse(line))
		.filter((e) => !!e && typeof e === "object" && Reflect.get(e, "type") === "message_end")
		.map((e) => Reflect.get(e as object, "message") as AssistantMessage)
		.filter((m) => m?.role === "assistant");
}

export function parseStream(jsonl: string): Omit<AgentRun, "wallMs" | "exitCode"> {
	const messages = assistantMessages(jsonl);
	const sum = (pick: (m: AssistantMessage) => number | undefined) =>
		messages.reduce((n, m) => n + (pick(m) ?? 0), 0);
	const usage: Usage = {
		input: sum((m) => m.usage?.input),
		output: sum((m) => m.usage?.output),
		cacheRead: sum((m) => m.usage?.cacheRead),
		cacheWrite: sum((m) => m.usage?.cacheWrite),
		cost: sum((m) => m.usage?.cost?.total),
	};
	const texts = messages
		.map((m) =>
			(m.content ?? [])
				.filter((b) => b.type === "text" && b.text)
				.map((b) => b.text)
				.join("\n")
				.trim(),
		)
		.filter((t) => t !== "");
	return {
		usage,
		turns: messages.length,
		toolCalls: sum((m) => m.content?.filter((b) => b.type === "toolCall").length),
		reply: texts.join("\n\n"),
		finalReply: texts.at(-1) ?? "",
		providers: [...new Set(messages.flatMap((m) => (m.provider ? [m.provider] : [])))],
	};
}

export type AgentOptions = {
	model: string;
	thinking: string;
	prompt: string;
	cwd: string;
	appendSystemPrompt: string | undefined;
	scratchDir: string;
	maxMinutes: number;
	noTools?: boolean; // judge calls: plain completion, no tool access
	// Multi-step projects: keep the session in `dir`; `resume` continues the latest one there.
	session?: { dir: string; resume: boolean };
};

export async function runAgent(opts: AgentOptions): Promise<AgentRun & { raw: string }> {
	const overlay = join(opts.scratchDir, "overlay.yml");
	writeFileSync(overlay, OVERLAY);
	const args = [
		"-p",
		"--mode",
		"json",
		"--model",
		opts.model,
		"--thinking",
		opts.thinking,
		"--no-skills",
		"--no-rules",
		"--no-extensions",
		"--no-lsp",
		...(opts.session
			? ["--session-dir", opts.session.dir, ...(opts.session.resume ? ["--continue"] : [])]
			: ["--no-session"]),
		"--no-title",
		"--auto-approve",
		"--config",
		overlay,
		...(opts.noTools ? ["--no-tools"] : ["--tools", "read,bash,edit,write,grep,glob"]),
		"--max-time",
		`${opts.maxMinutes}m`,
		"--cwd",
		opts.cwd,
	];
	if (opts.appendSystemPrompt !== undefined) {
		const file = join(opts.scratchDir, "append.md");
		writeFileSync(file, opts.appendSystemPrompt);
		args.push("--append-system-prompt", file);
	}
	// The prompt goes in on stdin, not argv, and each run gets its own PID namespace when bwrap
	// exists: an agent's `pkill -f server.mjs` otherwise matches sibling runs whose argv holds
	// the same words, and kills them (seen as omp exit 143 in the first project batch).
	const [cmd, argv] = HAS_BWRAP
		? ["bwrap", ["--dev-bind", "/", "/", "--unshare-pid", "--proc", "/proc", "--die-with-parent", "omp", ...args]]
		: ["omp", args];
	const started = Date.now();
	const child = spawn(cmd, argv, { cwd: opts.cwd, stdio: ["pipe", "pipe", "pipe"] });
	child.stdin.end(opts.prompt);
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
