#!/usr/bin/env python3
"""Set the next Aexinide wallpaper (random or sequential) via GSettings."""
import json, random, subprocess
from pathlib import Path

CONF = Path.home() / ".config/aexinide-wallpapers/config.json"
STATE = Path.home() / ".local/state/aexinide-wallpapers/state.json"
EXT = {".jpg", ".jpeg", ".png", ".webp"}

conf = {"mode": "random", "repo": "", "categories": [], "extra_dirs": []}
conf.update(json.loads(CONF.read_text()))

def collect():
    files = []
    repo = Path(conf["repo"]).expanduser() / "wallpapers"
    
    # Check if the wallpapers directory exists
    if repo.is_dir():
        # Scan files directly inside the wallpapers folder
        files += [f for f in repo.glob("*") if f.suffix.lower() in EXT]
        
        # Keep old category folder behavior just in case you use them later
        for cat in sorted(p for p in repo.iterdir() if p.is_dir()):
            if conf["categories"] and cat.name not in conf["categories"]:
                continue
            files += [f for f in cat.rglob("*") if f.suffix.lower() in EXT]
            
    for d in conf["extra_dirs"]:
        d = Path(d).expanduser()
        if d.is_dir():
            files += [f for f in d.rglob("*") if f.suffix.lower() in EXT]
    return sorted(set(files))

files = collect()
if not files:
    raise SystemExit("No wallpapers found. Place images directly in the wallpapers/ folder.")

try:
    state = json.loads(STATE.read_text())
except Exception:
    state = {}

if conf["mode"] == "sequential":
    idx = (state.get("index", -1) + 1) % len(files)
    pick = files[idx]
    state["index"] = idx
else:
    choices = [f for f in files if str(f) != state.get("last")] or files
    pick = random.choice(choices)
state["last"] = str(pick)

STATE.parent.mkdir(parents=True, exist_ok=True)
STATE.write_text(json.dumps(state))

uri = pick.resolve().as_uri()
for key in ("picture-uri", "picture-uri-dark"):
    subprocess.run(["gsettings", "set", "org.gnome.desktop.background", key, uri], check=True)
subprocess.run(["gsettings", "set", "org.gnome.desktop.background", "picture-options", "zoom"], check=True)
print("Wallpaper:", pick)
