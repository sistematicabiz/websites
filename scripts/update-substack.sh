#!/usr/bin/env bash
# Used by .github/workflows/update-substack.yml.
# Commits the Substack data only if it changed, so Netlify publishes only when there is something new.
set -euo pipefail

DATA="sites/laura/src/_data/substack.json"

output="$(node scripts/fetch-substack.mjs 2>&1)"
echo "$output"

if grep -q "could not update" <<<"$output"; then
  echo "::warning::Substack feed could not be read. The site keeps the last saved posts."
  exit 0
fi

if git diff --quiet -- "$DATA"; then
  echo "No change in the latest posts: nothing to publish."
  exit 0
fi

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -- "$DATA"
git commit -m "Update latest Substack posts"
git pull --rebase origin main
git push origin HEAD:main
echo "New posts committed: Netlify will publish Laura's site."
