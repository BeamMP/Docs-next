#!/usr/bin/env python3
"""
Draws the picture shown when a docs link is shared (Discord, Slack, X, ...):
docs/public/assets/core/social-card.png, 1200x630.

It uses BeamMP's own landing photo and logo, darkened the way the Website's hero is, with
the title and an orange-to-red bar like the Website's buttons. Run it again if the wording
or the artwork changes, and commit the result:

    python3 scripts/make-social-card.py /path/to/beamng-mp-landing.png /path/to/beammp_light.png
"""

import sys
from PIL import Image, ImageDraw, ImageFont

landing, logo, out = sys.argv[1], sys.argv[2], 'docs/public/assets/core/social-card.png'
W, H = 1200, 630
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'

photo = Image.open(landing).convert('RGB')
scale = H / photo.height
photo = photo.resize((round(photo.width * scale), H), Image.LANCZOS)
left = (photo.width - W) // 2
card = photo.crop((left, 0, left + W, H))

# Darken: an even veil, plus a stronger one on the left where the text sits.
veil = Image.new('RGBA', (W, H), (3, 7, 18, 0))
px = veil.load()
for x in range(W):
    for y in range(H):
        a = 170 + int(70 * max(0, 1 - x / (W * 0.75)))
        px[x, y] = (3, 7, 18, min(a, 235))
card = Image.alpha_composite(card.convert('RGBA'), veil)

draw = ImageDraw.Draw(card)
mark = Image.open(logo).convert('RGBA')
mark = mark.resize((round(mark.width * 0.9), round(mark.height * 0.9)), Image.LANCZOS)
card.alpha_composite(mark, (72, 70))

title = ImageFont.truetype(FONT_BOLD, 92)
tagline = ImageFont.truetype(FONT, 38)
draw.text((72, 285), 'Documentation', font=title, fill=(255, 255, 255, 255))

# the orange-to-red bar, as on the Website's primary button
bar_w, bar_h, bar_y = 150, 8, 405
for x in range(bar_w):
    t = x / (bar_w - 1)
    colour = (round(243 + (220 - 243) * t), round(109 + (38 - 109) * t), round(36 + (38 - 36) * t), 255)
    draw.rectangle((72 + x, bar_y, 72 + x, bar_y + bar_h), fill=colour)

draw.text((72, 440), 'Guides for players, server owners', font=tagline, fill=(209, 213, 219, 255))
draw.text((72, 488), 'and developers', font=tagline, fill=(209, 213, 219, 255))

card.convert('RGB').save(out, optimize=True)
print('wrote', out, card.size)
