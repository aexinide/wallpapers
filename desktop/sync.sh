#!/usr/bin/env bash
# Pull new wallpapers from GitHub. Never overwrites local changes.
set -euo pipefail

CFG="$HOME/.config/aexinide-wallpapers/config.json"

# Exit gracefully if the service fires before installation is fully complete
if [ ! -f "$CFG" ]; then
  echo "Configuration file not found. Skipping sync." >&2
  exit 1
fi

REPO="$(python3 -c 'import json,os;print(json.load(open(os.path.expanduser("~/.config/aexinide-wallpapers/config.json")))["repo"])')"

if [ ! -d "$REPO/.git" ]; then
  echo "Error: '$REPO' is not a valid git repository folder." >&2
  exit 1
fi

# Fetch and merge updates safely. Auto-stash prevents any local edits 
# to your flat wallpapers folder from blocking automated upstream updates.
git -C "$REPO" fetch --all
git -C "$REPO" pull --ff-only || {
  echo "Fast-forward blocked. Stashing local changes to complete pull..." >&2
  git -C "$REPO" stash
  git -C "$REPO" pull --ff-only
  git -C "$REPO" stash pop 2>/dev/null || true
}
