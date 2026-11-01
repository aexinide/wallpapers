#!/usr/bin/env python3
"""Build previews/ (600px WebP) and metadata/wallpapers.json from wallpapers/.
Needs Pillow:  sudo apt install python3-pil   (or: pip install pillow)"""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
EXT = {".jpg", ".jpeg", ".png", ".webp"}
WIDTH = 600
Image.MAX_IMAGE_PIXELS = None

items = []
for f in sorted((root / "wallpapers").rglob("*")):
    if not f.is_file() or f.suffix.lower() not in EXT:
        continue
    rel = f.relative_to(root)
    thumb_rel = Path("previews") / rel.parent.relative_to("wallpapers") / (f.name + ".webp")
    thumb = root / thumb_rel
    with Image.open(f) as im:
        w, h = im.size
        if not thumb.exists() or thumb.stat().st_mtime < f.stat().st_mtime:
            thumb.parent.mkdir(parents=True, exist_ok=True)
            t = im.convert("RGB")
            t.thumbnail((WIDTH, 100000))
            t.save(thumb, "WEBP", quality=72, method=4)
    items.append({
        "file": rel.as_posix(),
        "thumb": thumb_rel.as_posix(),
        "name": f.stem.replace("-", " ").replace("_", " "),
        "category": f.parent.name,
        "width": w,
        "height": h,
    })

out = root / "metadata/wallpapers.json"
out.write_text(json.dumps(items, indent=2))
print(f"{len(items)} wallpapers -> {out}")
