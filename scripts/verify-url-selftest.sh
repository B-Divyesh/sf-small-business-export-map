#!/usr/bin/env bash
set -euo pipefail
node scripts/test-server.mjs >/tmp/export-map-test-server.log 2>&1 &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  if curl -fsS http://127.0.0.1:4173/ >/dev/null 2>&1; then break; fi
  sleep 0.25
done
bash scripts/verify-url.sh http://127.0.0.1:4173/
