// JSON file persistence for the todo CLI.
import fs from 'node:fs';

export function load(path, cb) {
  fs.readFile(path, 'utf8', (err, text) => {
    if (err) return cb(err);
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      return cb(parseErr);
    }
    cb(null, data);
  });
}

// Write to a temp file then rename, so a crash never leaves a half-written store.
export function save(path, data, cb) {
  const tmp = `${path}.tmp`;
  fs.writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`, (err) => {
    if (err) return cb(err);
    fs.rename(tmp, path, cb);
  });
}
