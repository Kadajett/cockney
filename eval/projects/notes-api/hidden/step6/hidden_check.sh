#!/usr/bin/env bash
# Explain-only step: tracked files must be unchanged since the previous step (HEAD).
if ! git diff --quiet HEAD -- .; then
  echo "FAIL: explain step modified tracked files:" >&2
  git diff --stat HEAD -- . >&2
  exit 1
fi
echo "notes-api step 6: ok (no tracked changes)"
