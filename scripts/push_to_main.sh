#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if ! git diff --cached --quiet; then
  echo "Refusing to push: the index contains uncommitted staged changes." >&2
  exit 1
fi

head_sha="$(git rev-parse HEAD)"

if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
  git fetch origin main
  main_sha="$(git rev-parse origin/main)"

  if [[ "$head_sha" == "$main_sha" ]]; then
    echo "origin/main is already at $head_sha"
    exit 0
  fi

  if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "Refusing to push: HEAD is not a fast-forward of origin/main." >&2
    exit 1
  fi

  git diff --check origin/main..HEAD
else
  git diff-tree --check --root "$head_sha"
fi

git push origin HEAD:main

remote_sha="$(git ls-remote --heads origin main | awk '{print $1}')"
if [[ "$remote_sha" != "$head_sha" ]]; then
  echo "Push verification failed: origin/main is $remote_sha, expected $head_sha." >&2
  exit 1
fi

echo "Verified origin/main at $head_sha"
