#!/usr/bin/env bash
set -euo pipefail

PATCH="${1:-_antigravity_drop/antigravity.patch}"

if [ ! -f "$PATCH" ]; then
  echo "Finner ikke patch-fil: $PATCH"
  echo "Legg patchen her: _antigravity_drop/antigravity.patch"
  exit 1
fi

echo "Tester patch (dry-run)..."
git apply --check "$PATCH"

echo "Påfører patch..."
git apply "$PATCH"

echo "Ferdig. Kjør: git status"
