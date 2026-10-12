import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";

const file = process.env.NOTES_FILE ?? "notes.json";
const notes = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
let nextId = Math.max(0, ...notes.map((n) => n.id)) + 1;

const save = () => writeFileSync(file, JSON.stringify(notes, null, 2));

function send(res, status, body) {
	if (body === undefined) return res.writeHead(status).end();
	res.writeHead(status, { "content-type": "application/json" });
	res.end(JSON.stringify(body));
}

async function readBody(req) {
	let data = "";
	for await (const chunk of req) data += chunk;
	return data;
}

function parseText(raw) {
	let body;
	try {
		body = JSON.parse(raw);
	} catch {
		return { error: "body must be JSON" };
	}
	const text = body?.text;
	if (typeof text !== "string" || text === "") return { error: "text must be a non-empty string" };
	if (text.length > 500) return { error: "text must be at most 500 characters" };
	return { text };
}

createServer(async (req, res) => {
	const { pathname } = new URL(req.url, "http://localhost");
	res.on("finish", () => console.log(`${req.method} ${pathname} ${res.statusCode}`));
	if (req.method === "GET" && pathname === "/health") return send(res, 200, { ok: true });
	if (req.method === "GET" && pathname === "/notes") return send(res, 200, notes);
	if (req.method === "POST" && pathname === "/notes") {
		const { text, error } = parseText(await readBody(req));
		if (error) return send(res, 400, { error });
		const note = { id: nextId++, text };
		notes.push(note);
		save();
		return send(res, 201, note);
	}
	const match = pathname.match(/^\/notes\/([^/]+)$/);
	const index = match ? notes.findIndex((n) => String(n.id) === match[1]) : -1;
	if (index !== -1 && req.method === "GET") return send(res, 200, notes[index]);
	if (index !== -1 && req.method === "DELETE") {
		notes.splice(index, 1);
		save();
		return send(res, 204);
	}
	send(res, 404, { error: "not found" });
}).listen(process.env.PORT ?? 3000);
