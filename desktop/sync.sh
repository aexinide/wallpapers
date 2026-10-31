#!/usr/bin/env bash
# Pull new wallpapers from GitHub. Never overwrites local changes.
set -euo pipefail
REPO="$(python3 -c 'import json,os;print(json.load(open(os.path.expanduser("~/.config/aexinide-wallpapers/config.json")))["repo"])')"
git -C "$REPO" pull --ff-only
