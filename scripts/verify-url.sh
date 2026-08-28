#!/usr/bin/env bash
set -euo pipefail

url="${1:-http://127.0.0.1:4173/}"
html="$(curl -fsSL "$url")"
[[ "$html" == *'<html lang="en"'* ]]
[[ "$html" == *'<title>'* ]]
[[ "$html" == *'id="main"'* ]]
[[ "$html" == *'alt='* ]]
printf 'verify-url: title, lang, main, and image alt present at %s\n' "$url"
