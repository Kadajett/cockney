#!/usr/bin/env node
// Usage: node cli.mjs <file> list | add <text...> | done <n>
import { load, save } from './store.mjs';

const [file = 'todos.json', cmd = 'list', ...rest] = process.argv.slice(2);

async function main() {
  let todos = [];
  try {
    todos = await load(file);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  if (cmd === 'list') {
    todos.forEach((t, i) => console.log(`${i + 1}. [${t.done ? 'x' : ' '}] ${t.text}`));
    return;
  }
  if (cmd === 'add') {
    todos.push({ text: rest.join(' '), done: false });
    return save(file, todos);
  }
  if (cmd === 'done') {
    const todo = todos[Number(rest[0]) - 1];
    if (!todo) throw new Error(`no todo #${rest[0]}`);
    todo.done = true;
    return save(file, todos);
  }
  throw new Error(`unknown command: ${cmd}`);
}

main().catch((err) => {
  console.error(`todo: ${err.message}`);
  process.exitCode = 1;
});
