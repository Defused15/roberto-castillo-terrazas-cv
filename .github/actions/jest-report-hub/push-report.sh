#!/usr/bin/env bash
# Push a Jest JSON report to the QA Test Hub repo and dispatch a hub rebuild.
#
# Env:
#   GH_TOKEN      token with Contents read/write on HUB_REPO (required)
#   HUB_REPO      owner/repo of the hub (required)
#   PROJECT_NAME  folder key under projects/ in the hub (required)
#   REPORT_PATH   path to the Jest JSON report (default: jest-report/report.json)
#   MAX_ATTEMPTS  PUT attempts on a sha conflict (default: 3)
#   RETRY_DELAY   base delay in seconds between attempts (default: 3)
#   TMP_DIR       scratch dir for the request body (default: $RUNNER_TEMP or /tmp)
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${HUB_REPO:?HUB_REPO is required}"
: "${PROJECT_NAME:?PROJECT_NAME is required}"
REPORT_PATH="${REPORT_PATH:-jest-report/report.json}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
RETRY_DELAY="${RETRY_DELAY:-3}"
TMP_DIR="${TMP_DIR:-${RUNNER_TEMP:-/tmp}}"

if [ ! -f "$REPORT_PATH" ]; then
  echo "::error::$REPORT_PATH not found, cannot upload to hub"
  exit 1
fi

FILE_API="repos/$HUB_REPO/contents/projects/$PROJECT_NAME/latest.json"
B64="$TMP_DIR/report.b64"
BODY="$TMP_DIR/hub-payload.json"
ERR="$TMP_DIR/hub-put.err"

# The base64 report is too large for a single CLI argument (MAX_ARG_STRLEN), so it goes in a body file
base64 < "$REPORT_PATH" | tr -d '\n' > "$B64"

attempt=1
while :; do
  # Re-read the current sha on every attempt: a concurrent writer may have moved it (HTTP 409)
  SHA=$(gh api "$FILE_API" --jq '.sha' 2>/dev/null || true)

  jq -n \
    --arg message "chore: update $PROJECT_NAME report" \
    --rawfile content "$B64" \
    --arg sha "$SHA" \
    '{message: $message, content: $content} + (if $sha == "" then {} else {sha: $sha} end)' \
    > "$BODY"

  if gh api "$FILE_API" --method PUT --input "$BODY" > /dev/null 2> "$ERR"; then
    echo "Report pushed to hub (attempt $attempt)"
    break
  fi

  cat "$ERR" >&2
  # 409 = sha mismatch; 422 only when it is about the sha (file created concurrently, sha not
  # supplied). Anything else, including other 422 validation errors, is not retryable.
  if ! { grep -q 'HTTP 409' "$ERR" || { grep -q 'HTTP 422' "$ERR" && grep -q -i 'sha' "$ERR"; }; }; then
    echo "::error::Hub PUT failed with a non-retryable error"
    exit 1
  fi
  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo "::error::Could not push report to $HUB_REPO after $MAX_ATTEMPTS attempts"
    exit 1
  fi
  echo "sha conflict on attempt $attempt, re-reading sha and retrying..."
  sleep $((attempt * RETRY_DELAY))
  attempt=$((attempt + 1))
done

echo "Triggering hub rebuild in $HUB_REPO..."
gh api "repos/$HUB_REPO/dispatches" \
  --method POST \
  -f event_type="test-hub-trigger" \
  -f "client_payload[project]=$PROJECT_NAME"
echo "Hub rebuild dispatched"
