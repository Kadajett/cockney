import { createServer } from "node:http";

const notes = [];
let nextId = 1;

function send(res, status, body) {
	res.writeHead(status, { "content-type": "application/json" });
	res.end(JSON.stringify(body));
}

async function readBody(req) {
	let data = "";
	for await (const chunk of req) data += chunk;
	return data;
}

createServer(async (req, res) => {
	const { pathname } = new URL(req.url, "http://localhost");
	if (req.method === "GET" && pathname === "/health") return send(res, 200, { ok: true });
	if (req.method === "GET" && pathname === "/notes") return send(res, 200, notes);
	if (req.method === "POST" && pathname === "/notes") {
		const { text } = JSON.parse(await readBody(req));
		const note = { id: nextId++, text };
		notes.push(note);
		return send(res, 201, note);
	}
	send(res, 404, { error: "not found" });
}).listen(process.env.PORT ?? 3000);
