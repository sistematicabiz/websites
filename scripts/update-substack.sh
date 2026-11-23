#!/usr/bin/env bash
# Used by .github/workflows/update-substack.yml.
# When the latest Substack posts change, opens (or updates) one pull request.
# Nothing is written to main: merging the pull request is what publishes Laura's site.
set -euo pipefail

DATA="sites/laura/src/_data/substack.json"
BRANCH="automation/substack-update"
TITLE="Update latest Substack posts"
BODY_JS='
  const { items } = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  console.log("New data from the Moral Revolution feed. Merging this publishes the site.\n");
  for (const i of items) console.log(`- ${i.date}: [${i.title}](${i.link})`);
'

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

# Already proposed in the open pull request? Then there is nothing to add.
if git fetch --quiet origin "refs/heads/$BRANCH:refs/remotes/origin/$BRANCH" 2>/dev/null \
  && git diff --quiet "origin/$BRANCH" -- "$DATA"; then
  echo "These posts are already in the pull request."
else
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git checkout --quiet -B "$BRANCH"
  git add -- "$DATA"
  git commit --quiet -m "$TITLE"
  git push --quiet --force origin "HEAD:refs/heads/$BRANCH"
fi

if [ "$(gh pr list --head "$BRANCH" --state open --json number --jq length)" = "0" ]; then
  body="$(node -e "$BODY_JS" "$DATA")"
  gh pr create --base main --head "$BRANCH" --title "$TITLE" --body "$body"
else
  echo "Pull request already open: updated."
fi
