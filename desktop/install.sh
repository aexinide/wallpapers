#!/usr/bin/env bash
# Usage: ./desktop/install.sh [interval] [mode]
#   interval: systemd time span, default 5min
#   mode: random | sequential, default random
set -euo pipefail
INTERVAL="${1:-5min}"; MODE="${2:-random}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
CFG="$HOME/.config/aexinide-wallpapers"
UNITS="$HOME/.config/systemd/user"
mkdir -p "$CFG" "$UNITS" "$HOME/Pictures/Aexinide-Wallpapers/favorites"

# Back up current wallpaper settings once
if [ ! -f "$CFG/backup.txt" ]; then
  for k in picture-uri picture-uri-dark picture-options; do
    echo "$k=$(gsettings get org.gnome.desktop.background $k)"
  done > "$CFG/backup.txt"
fi

# Write config (keeps your edits if it already exists)
if [ ! -f "$CFG/config.json" ]; then
cat > "$CFG/config.json" <<JSON
{
  "mode": "$MODE",
  "repo": "$REPO",
  "categories": [],
  "extra_dirs": ["~/Pictures/Aexinide-Wallpapers/favorites"]
}
JSON
fi

for u in aexinide-rotate.service aexinide-rotate.timer aexinide-sync.service aexinide-sync.timer; do
  sed -e "s|@REPO@|$REPO|g" -e "s|@INTERVAL@|$INTERVAL|g" "$REPO/desktop/systemd/$u" > "$UNITS/$u"
done

systemctl --user daemon-reload
systemctl --user enable --now aexinide-rotate.timer aexinide-sync.timer
systemctl --user start aexinide-rotate.service || echo "Add images to wallpapers/<category>/ then re-run."
echo "Installed. Rotating every $INTERVAL ($MODE). Config: $CFG/config.json"
