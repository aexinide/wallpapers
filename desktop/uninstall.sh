#!/usr/bin/env bash
set -euo pipefail
CFG="$HOME/.config/aexinide-wallpapers"
systemctl --user disable --now aexinide-rotate.timer aexinide-sync.timer 2>/dev/null || true
rm -f "$HOME"/.config/systemd/user/aexinide-{rotate,sync}.{service,timer}
systemctl --user daemon-reload
if [ -f "$CFG/backup.txt" ]; then
  while IFS='=' read -r k v; do
    gsettings set org.gnome.desktop.background "$k" "$v"
  done < "$CFG/backup.txt"
fi
echo "Removed. Previous wallpaper restored. Config kept in $CFG"
