#!/usr/bin/env python3
"""
Scan the current directory for images, extract dimensions, and write
image_widths_heights.json for the vibes gallery.

Usage:
    cd vibes/
    python lister.py

Requires:
    pip install Pillow pillow-heif
"""

import json
import os
from pathlib import Path

try:
    from PIL import Image
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    print("Missing dependencies. Run: pip install Pillow pillow-heif")
    raise

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".avif"}

here = Path(__file__).parent
result = {}

for p in sorted(here.iterdir()):
    if p.suffix.lower() not in IMAGE_EXTS:
        continue
    try:
        with Image.open(p) as img:
            w, h = img.size
        result[p.name] = {"width": w, "height": h}
        print(f"  {p.name}: {w}x{h}")
    except Exception as e:
        print(f"  skipping {p.name}: {e}")

out = here / "image_widths_heights.json"
with open(out, "w") as f:
    json.dump(result, f, indent=2)

print(f"\nWrote {len(result)} entries to {out.name}")
