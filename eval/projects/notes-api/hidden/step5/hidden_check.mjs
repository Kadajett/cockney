// Behavioural check for notes-api. Usage: node hidden_check.mjs <step>
// Starts `node server.mjs` on a free port, exercises the HTTP API, always kills the server.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const STEP = Number(process.argv[2]);
const servers = new Set();
const tmp = mkdtempSync(join(tmpdir(), "notes-api-check-"));

function freePort() {
	return new Promise((resolve, reject) => {
		const srv = createServer();
		srv.on("error", reject);
		srv.listen(0, "127.0.0.1", () => {
			const { port } = srv.address();
			srv.close(() => resolve(port));
		});
	});
}

async function start(env = {}) {
	const port = await freePort();
	const childEnv = { ...process.env, PORT: String(port), ...env };
	for (const [k, v] of Object.entries(childEnv)) if (v === undefined) delete childEnv[k];
	const child = spawn(process.execPath, ["server.mjs"], { env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
	const srv = { child, port, stdout: "", stderr: "", requests: 0, exited: false };
	child.stdout.on("data", (d) => (srv.stdout += d));
	child.stderr.on("data", (d) => (srv.stderr += d));
	child.on("exit", () => (srv.exited = true));
	servers.add(srv);
	const deadline = Date.now() + 10_000;
	while (Date.now() < deadline) {
		if (srv.exited) throw new Error(`server exited on startup:\n${srv.stdout}${srv.stderr}`);
		try {
			const r = await fetch(`http://127.0.0.1:${port}/health`);
			srv.requests++;
			await r.text();
			if (r.status === 200) return srv;
		} catch {}
		await new Promise((r) => setTimeout(r, 100));
	}
	throw new Error(`server did not answer GET /health with 200 within 10s:\n${srv.stdout}${srv.stderr}`);
}

async function stop(srv) {
	if (!srv.exited) {
		const gone = new Promise((r) => srv.child.once("exit", r));
		srv.child.kill("SIGKILL");
		await gone;
	}
	servers.delete(srv);
}

// raw: send body as-is (string); otherwise JSON-encode.
async function req(srv, method, path, { body, raw } = {}) {
	const init = { method, headers: {} };
	if (raw !== undefined) init.body = raw;
	else if (body !== undefined) init.body = JSON.stringify(body);
	if (init.body !== undefined) init.headers["content-type"] = "application/json";
	const r = await fetch(`http://127.0.0.1:${srv.port}${path}`, init);
	srv.requests++;
	const text = await r.text();
	let json;
	try {
		json = text === "" ? undefined : JSON.parse(text);
	} catch {}
	return { status: r.status, text, json, type: r.headers.get("content-type") ?? "" };
}

function expectJson(res, status, what) {
	assert.equal(res.status, status, `${what}: expected status ${status}, got ${res.status} body=${res.text}`);
	assert.match(res.type, /application\/json/, `${what}: content-type should be application/json`);
	assert.notEqual(res.json, undefined, `${what}: body is not JSON: ${res.text}`);
	return res.json;
}

function expectNotFound(res, what) {
	assert.deepEqual(expectJson(res, 404, what), { error: "not found" }, `${what}: body`);
}

function expectBadRequest(res, what) {
	const body = expectJson(res, 400, what);
	assert.equal(typeof body?.error, "string", `${what}: body should be {"error": string}, got ${res.text}`);
	assert.ok(body.error.length > 0, `${what}: error message empty`);
}

async function create(srv, text) {
	const note = expectJson(await req(srv, "POST", "/notes", { body: { text } }), 201, `POST /notes ${JSON.stringify(text)}`);
	assert.equal(note.text, text, "created note text");
	assert.ok(note.id !== undefined && note.id !== null && note.id !== "", "created note has an id");
	return note;
}

async function list(srv) {
	const notes = expectJson(await req(srv, "GET", "/notes"), 200, "GET /notes");
	assert.ok(Array.isArray(notes), "GET /notes returns an array");
	return notes;
}

function noDependencies() {
	assert.ok(!existsSync("node_modules"), "node_modules/ should not exist (no dependencies)");
	if (existsSync("package.json")) {
		const pkg = JSON.parse(readFileSync("package.json", "utf8"));
		for (const key of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
			assert.ok(!pkg[key] || Object.keys(pkg[key]).length === 0, `package.json should not declare ${key}`);
		}
	}
}

async function basics(srv) {
	expectJson(await req(srv, "GET", "/health"), 200, "GET /health");
	assert.deepEqual((await req(srv, "GET", "/health")).json, { ok: true }, "GET /health body");
	const before = await list(srv);
	const a = await create(srv, "buy milk");
	const b = await create(srv, "call mum ✓");
	assert.notEqual(String(a.id), String(b.id), "ids are unique");
	const after = await list(srv);
	assert.equal(after.length, before.length + 2, "GET /notes includes the new notes");
	for (const n of [a, b]) {
		assert.ok(
			after.some((x) => String(x.id) === String(n.id) && x.text === n.text),
			`GET /notes contains ${JSON.stringify(n)}`,
		);
	}
	expectNotFound(await req(srv, "GET", "/nope"), "GET /nope");
	return [a, b];
}

async function byId(srv) {
	const n = await create(srv, "fetch me");
	assert.deepEqual(
		expectJson(await req(srv, "GET", `/notes/${n.id}`), 200, "GET /notes/:id"),
		{ id: n.id, text: n.text },
		"GET /notes/:id body",
	);
	expectNotFound(await req(srv, "GET", "/notes/999999"), "GET /notes/999999");
	const del = await req(srv, "DELETE", `/notes/${n.id}`);
	assert.equal(del.status, 204, `DELETE /notes/:id should be 204, got ${del.status}`);
	assert.equal(del.text, "", "204 has no body");
	expectNotFound(await req(srv, "GET", `/notes/${n.id}`), "GET after DELETE");
	expectNotFound(await req(srv, "DELETE", `/notes/${n.id}`), "DELETE twice");
	expectNotFound(await req(srv, "DELETE", "/notes/999999"), "DELETE unknown");
	assert.ok(!(await list(srv)).some((x) => String(x.id) === String(n.id)), "deleted note gone from GET /notes");
}

async function validation(srv) {
	const before = (await list(srv)).length;
	expectBadRequest(await req(srv, "POST", "/notes", { raw: "{not json" }), "non-JSON body");
	expectBadRequest(await req(srv, "POST", "/notes", { raw: "" }), "empty body");
	expectBadRequest(await req(srv, "POST", "/notes", { body: {} }), "missing text");
	expectBadRequest(await req(srv, "POST", "/notes", { body: null }), "null body");
	expectBadRequest(await req(srv, "POST", "/notes", { body: { text: 42 } }), "numeric text");
	expectBadRequest(await req(srv, "POST", "/notes", { body: { text: ["a"] } }), "array text");
	expectBadRequest(await req(srv, "POST", "/notes", { body: { text: "" } }), "empty text");
	expectBadRequest(await req(srv, "POST", "/notes", { body: { text: "x".repeat(501) } }), "501-char text");
	assert.equal((await list(srv)).length, before, "rejected notes are not stored");
	expectJson(await req(srv, "GET", "/health"), 200, "server still healthy after bad input");
	await create(srv, "y".repeat(500));
}

async function persistence() {
	const file = join(tmp, "store.json");
	const s1 = await start({ NOTES_FILE: file });
	const a = await create(s1, "survives restart");
	await stop(s1);
	assert.ok(existsSync(file), "NOTES_FILE is written");
	const stored = JSON.parse(readFileSync(file, "utf8"));
	assert.ok(JSON.stringify(stored).includes("survives restart"), "NOTES_FILE contains the note");

	const s2 = await start({ NOTES_FILE: file });
	assert.deepEqual(
		expectJson(await req(s2, "GET", `/notes/${a.id}`), 200, "GET note after restart"),
		{ id: a.id, text: a.text },
		"note survives restart",
	);
	const b = await create(s2, "after restart");
	assert.notEqual(String(b.id), String(a.id), "ids stay unique across restarts");
	const del = await req(s2, "DELETE", `/notes/${a.id}`);
	assert.equal(del.status, 204, "DELETE after restart");
	await stop(s2);

	const s3 = await start({ NOTES_FILE: file });
	expectNotFound(await req(s3, "GET", `/notes/${a.id}`), "deleted note stays deleted after restart");
	const notes = await list(s3);
	assert.ok(notes.some((x) => String(x.id) === String(b.id) && x.text === "after restart"), "second note persisted");
	await stop(s3);

	// Default file: notes.json in the working directory.
	rmSync("notes.json", { force: true });
	const s4 = await start({ NOTES_FILE: undefined });
	await create(s4, "default file");
	await stop(s4);
	assert.ok(existsSync("notes.json"), "default NOTES_FILE is notes.json");
	assert.ok(readFileSync("notes.json", "utf8").includes("default file"), "notes.json contains the note");
	const s5 = await start({ NOTES_FILE: undefined });
	assert.ok((await list(s5)).some((x) => x.text === "default file"), "notes.json is loaded on start");
	await stop(s5);
	rmSync("notes.json", { force: true });
}

const LOG_LINE = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \/\S* \d{3}$/;

async function logging() {
	const srv = await start({ NOTES_FILE: join(tmp, "log.json") });
	const n = await create(srv, "logged");
	await req(srv, "GET", `/notes/${n.id}`);
	await req(srv, "GET", "/notes/999999");
	await req(srv, "POST", "/notes", { raw: "{oops" });
	await req(srv, "DELETE", `/notes/${n.id}`);
	await req(srv, "GET", "/notes");
	const expected = [
		"GET /health 200",
		"POST /notes 201",
		`GET /notes/${n.id} 200`,
		"GET /notes/999999 404",
		"POST /notes 400",
		`DELETE /notes/${n.id} 204`,
		"GET /notes 200",
	];
	let lines = [];
	const deadline = Date.now() + 3000;
	while (Date.now() < deadline) {
		lines = srv.stdout.split("\n").map((l) => l.trim()).filter((l) => LOG_LINE.test(l));
		if (lines.length >= srv.requests) break;
		await new Promise((r) => setTimeout(r, 50));
	}
	await stop(srv);
	for (const line of expected) assert.ok(lines.includes(line), `stdout should contain the line "${line}"; got:\n${srv.stdout}`);
	assert.equal(lines.length, srv.requests, `expected exactly one log line per request (${srv.requests}); got:\n${srv.stdout}`);
	assert.deepEqual(lines.slice(-expected.length + 1), expected.slice(1), "log lines in request order");
}

async function main() {
	assert.ok([1, 2, 3, 4, 5].includes(STEP), "usage: node hidden_check.mjs <1-5>");
	noDependencies();
	const srv = await start({ NOTES_FILE: join(tmp, "notes.json") });
	await basics(srv);
	if (STEP >= 2) await byId(srv);
	if (STEP >= 3) await validation(srv);
	await stop(srv);
	if (STEP >= 4) await persistence();
	if (STEP >= 5) await logging();
}

let code = 0;
try {
	await main();
	console.log(`notes-api step ${STEP}: ok`);
} catch (err) {
	console.error(`notes-api step ${STEP}: FAIL\n${err?.stack ?? err}`);
	code = 1;
} finally {
	for (const srv of servers) await stop(srv);
	rmSync(tmp, { recursive: true, force: true });
}
process.exit(code);
