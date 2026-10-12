// omp extension: appends the cockney ruleset to the system prompt on every turn, so the mode
// holds for the whole session without the model having to pick the skill itself.
// Installed as ~/.omp/agent/extensions/cockney/index.ts next to ruleset.ts.
import { defaultMode, LEVELS, loadRuleset, type Mode, parseModeCommand } from "./ruleset.ts";

// The slice of omp's ExtensionAPI this extension uses (src/extensibility/extensions/types.ts),
// declared locally so the file runs and type-checks without omp's package on the path.
type Ctx = { ui: { notify(message: string, type?: "info" | "warning" | "error"): void } };
type ExtensionAPI = {
	registerCommand(
		name: string,
		options: {
			description?: string;
			getArgumentCompletions?: (prefix: string) => { value: string; label: string }[] | null;
			handler: (args: string, ctx: Ctx) => Promise<void>;
		},
	): void;
	on(
		event: "input",
		handler: (event: { text: string }, ctx: Ctx) => { handled?: boolean } | undefined,
	): void;
	on(
		event: "before_agent_start",
		handler: (event: { systemPrompt: string[] }) => { systemPrompt?: string[] } | undefined,
	): void;
};

export default function cockney(pi: ExtensionAPI): void {
	let mode: Mode = defaultMode();

	const describe = (): string =>
		mode === "off" ? "Cockney off. Speaking proper." : `Cockney mode: ${mode}`;

	pi.registerCommand("cockney", {
		description: `Cockney mode: ${LEVELS.join(" | ")} | off | status`,
		getArgumentCompletions: (prefix) =>
			[...LEVELS, "off", "status"]
				.filter((v) => v.startsWith(prefix))
				.map((v) => ({ value: v, label: v })),
		handler: async (args, ctx) => {
			const next = parseModeCommand(`/cockney ${args}`.trim());
			if (next === undefined) {
				ctx.ui.notify(`Unknown level "${args}". Try ${LEVELS.join(", ")} or off.`, "warning");
				return;
			}
			if (next !== "status") mode = next;
			ctx.ui.notify(describe(), "info");
		},
	});

	pi.on("input", (event, ctx) => {
		if (parseModeCommand(event.text) !== "off" || event.text.trim().startsWith("/")) return;
		mode = "off";
		ctx.ui.notify(describe(), "info");
		return { handled: true };
	});

	pi.on("before_agent_start", (event) => {
		if (mode === "off") return;
		return { systemPrompt: [...event.systemPrompt, loadRuleset(mode)] };
	});
}
