#!/usr/bin/env python3
"""Scan wallpapers/ and write metadata/wallpapers.json. Run before committing."""
import json
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    Image = None
root = Path(__file__).resolve().parent.parent
items = []
for f in sorted((root / "wallpapers").rglob("*")):
    if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    w = h = None
    if Image:
        with Image.open(f) as im:
            w, h = im.size
    items.append({
        "file": f.relative_to(root).as_posix(),
        "name": f.stem.replace("-", " ").replace("_", " "),
        "category": f.parent.name,
        "width": w, "height": h,
        "author": "Aexinide", "license": "CC BY 4.0",
    })
out = root / "metadata/wallpapers.json"
out.write_text(json.dumps(items, indent=2))
print(f"{len(items)} wallpapers -> {out}")
