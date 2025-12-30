#!/usr/bin/env bash
set -euo pipefail

ver="${1:-}"
if [[ -z "$ver" ]]; then
  echo "Usage: ./release.sh v0.2.0"
  exit 1
fi

echo "release $ver"

pnpm build

git add -A
git commit -m "Release $ver"

git tag "$ver"

git push
git push --tags
