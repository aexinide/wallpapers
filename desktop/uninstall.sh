#!/usr/bin/env bash
set -euo pipefail
CFG="$HOME/.config/aexinide-wallpapers"
STATE="$HOME/.local/state/aexinide-wallpapers"

# Stop and remove background timers safely
systemctl --user disable --now aexinide-rotate.timer aexinide-sync.timer 2>/dev/null || true
rm -f "$HOME"/.config/systemd/user/aexinide-{rotate,sync}.{service,timer}
systemctl --user daemon-reload

# Restore backup settings while safely stripping GNOME's literal single quotes
if [ -f "$CFG/backup.txt" ]; then
  while IFS='=' read -r k v; do
    # Strip leading and trailing single quotes so gsettings handles the string properly
    v_clean="${v#\'}"
    v_clean="${v_clean%\'}"
    gsettings set org.gnome.desktop.background "$k" "$v_clean"
  done < "$CFG/backup.txt"
fi

# Clean up local runtime state tracking directories
rm -rf "$STATE"

echo "Removed. Previous wallpaper restored. Config kept in $CFG"
