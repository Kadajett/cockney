#!/usr/bin/env node
// Usage: node cli.mjs <file> list | add <text...> | done <n>
import { load, save } from './store.mjs';

const [file = 'todos.json', cmd = 'list', ...rest] = process.argv.slice(2);

function finish(err) {
  if (err) {
    console.error(`todo: ${err.message}`);
    process.exitCode = 1;
  }
}

load(file, (err, todos) => {
  if (err && err.code !== 'ENOENT') return finish(err);
  todos = todos ?? [];

  if (cmd === 'list') {
    todos.forEach((t, i) => console.log(`${i + 1}. [${t.done ? 'x' : ' '}] ${t.text}`));
    return finish();
  }
  if (cmd === 'add') {
    todos.push({ text: rest.join(' '), done: false });
    return save(file, todos, finish);
  }
  if (cmd === 'done') {
    const todo = todos[Number(rest[0]) - 1];
    if (!todo) return finish(new Error(`no todo #${rest[0]}`));
    todo.done = true;
    return save(file, todos, finish);
  }
  finish(new Error(`unknown command: ${cmd}`));
});
