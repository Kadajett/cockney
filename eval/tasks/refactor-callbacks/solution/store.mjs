// JSON file persistence for the todo CLI.
import { readFile, rename, writeFile } from 'node:fs/promises';

export async function load(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

// Write to a temp file then rename, so a crash never leaves a half-written store.
export async function save(path, data) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`);
  await rename(tmp, path);
}
