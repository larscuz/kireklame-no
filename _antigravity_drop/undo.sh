#!/usr/bin/env bash
set -euo pipefail

PATCH="${1:-_antigravity_drop/antigravity.patch}"

if [ ! -f "$PATCH" ]; then
  echo "Finner ikke patch-fil: $PATCH"
  exit 1
fi

echo "Angrer patch..."
git apply -R "$PATCH"

echo "Ferdig. Kjør: git status"
