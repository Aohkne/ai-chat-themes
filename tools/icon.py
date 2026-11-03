# Draws the extension icon (extension/icons/*.png): a tile of ASCII-wallpaper cells around an orange spark.
# Run: python3 tools/icon.py   (needs Pillow)
import math
from pathlib import Path
from PIL import Image, ImageDraw

S = 512  # drawn big, then scaled down
out = Path(__file__).resolve().parent.parent / 'extension' / 'icons'

def gradient(w, h, top, bottom):
    img = Image.new('RGB', (w, h))
    px = img.load()
    for y in range(h):
        k = y / (h - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * k) for i in range(3))
        for x in range(w):
            px[x, y] = c
    return img

bg = gradient(S, S, (47, 128, 112), (12, 31, 43))
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * .22), fill=255)
icon = Image.new('RGBA', (S, S), (0, 0, 0, 0))
icon.paste(bg, (0, 0), mask)

# cells: a 6x6 grid, some lit in the scenes' colors
layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
n, pad = 6, S * .12
cell = (S - 2 * pad) / n
lit = {(0, 1): (216, 232, 106), (1, 0): (216, 232, 106), (1, 1): (216, 232, 106), (4, 0): (242, 155, 184),
       (5, 1): (242, 155, 184), (0, 4): (255, 184, 92), (0, 5): (255, 184, 92), (1, 5): (255, 184, 92),
       (5, 4): (216, 232, 106), (4, 5): (216, 232, 106), (5, 5): (216, 232, 106)}
for r in range(n):
    for c in range(n):
        x, y = pad + c * cell, pad + r * cell
        col = lit.get((c, r))
        fill = (*col, 200) if col else (255, 255, 255, 22)
        d.rounded_rectangle((x + 5, y + 5, x + cell - 5, y + cell - 5), radius=int(cell * .2), fill=fill)
icon = Image.alpha_composite(icon, layer)

# the spark: eight rays around a center, Claude orange
spark = Image.new('RGBA', (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(spark)
cx = cy = S / 2
orange = (217, 119, 87, 255)
for i in range(8):
    a = math.pi / 4 * i - math.pi / 2
    length = S * (.30 if i % 2 == 0 else .22)
    w = S * .045
    tip = (cx + math.cos(a) * length, cy + math.sin(a) * length)
    l = (cx + math.cos(a + math.pi / 2) * w, cy + math.sin(a + math.pi / 2) * w)
    r = (cx + math.cos(a - math.pi / 2) * w, cy + math.sin(a - math.pi / 2) * w)
    d.polygon([l, tip, r], fill=orange)
d.ellipse((cx - S * .06, cy - S * .06, cx + S * .06, cy + S * .06), fill=orange)
shadow = spark.copy().filter(__import__('PIL.ImageFilter', fromlist=['x']).GaussianBlur(S * .02))
dark = Image.new('RGBA', (S, S), (0, 0, 0, 0))
dark.putalpha(shadow.split()[3].point(lambda v: v * .5))
icon = Image.alpha_composite(icon, dark)
icon = Image.alpha_composite(icon, spark)

for size in (16, 32, 48, 128):
    icon.resize((size, size), Image.LANCZOS).save(out / f'{size}.png')
print('icons written to', out)
