#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-sillyfam}"

if ! command -v git >/dev/null 2>&1; then
  echo "git not found. Install git first." >&2
  exit 1
fi
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Install it and run 'gh auth login'." >&2
  exit 1
fi

git init
git add .
git commit -m "Initial commit: SillyFam Video Party"
gh repo create "$REPO_NAME" --public --source . --remote origin --push

remote="$(git remote get-url origin)"
echo "Repo pushed: $remote"
deployUrl="https://render.com/deploy?repo=$remote"
echo "Deploy to Render: $deployUrl"
if command -v xdg-open >/dev/null 2>&1; then xdg-open "$deployUrl"; fi
if command -v open >/dev/null 2>&1; then open "$deployUrl"; fi
