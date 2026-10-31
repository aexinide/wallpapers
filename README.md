# Aexinide Wallpapers

An open wallpaper collection with a public gallery (GitHub Pages) and an automatic wallpaper rotator for Ubuntu GNOME.

## Use on Ubuntu (GNOME)
```bash
git clone https://github.com/aexinide/wallpapers.git
cd wallpapers
./desktop/install.sh                      # every 5 min, random
./desktop/install.sh 15min sequential     # custom
```
Config: `~/.config/aexinide-wallpapers/config.json` (mode, categories, extra_dirs).
Personal images: drop them in `~/Pictures/Aexinide-Wallpapers/favorites/`.
Remove: `./desktop/uninstall.sh` (restores your previous wallpaper).

## Add wallpapers
Put images in `wallpapers/<category>/`, then:
```bash
python3 tools/generate_metadata.py
git add . && git commit -m "Add wallpapers" && git push
```
Only add images you created or have permission to redistribute.
