#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
ENV_FILE="$ROOT/.env.daily-contract"
TARGET="$ROOT/web/daily-contract/script.js"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

line="$(grep -E '^DAILY_CONTRACT_PASSWORD=' "$ENV_FILE" | head -n 1 || true)"
if [[ -z "$line" ]]; then
  echo "DAILY_CONTRACT_PASSWORD is not set in $ENV_FILE"
  exit 1
fi

password="${line#DAILY_CONTRACT_PASSWORD=}"
if [[ -z "$password" ]]; then
  echo "DAILY_CONTRACT_PASSWORD is empty in $ENV_FILE"
  exit 1
fi

# Support optional quoted value.
if [[ "$password" =~ ^\".*\"$ ]]; then
  password="${password:1:${#password}-2}"
fi
if [[ "$password" =~ ^\'.*\'$ ]]; then
  password="${password:1:${#password}-2}"
fi

hash="$(printf '%s' "$password" | shasum -a 256 | awk '{print $1}')"

perl -0777 -i -pe "s/const PASSWORD_SHA256_HEX = \"[^\"]*\";/const PASSWORD_SHA256_HEX = \"$hash\";/" "$TARGET"

echo "Updated password hash in $TARGET"
