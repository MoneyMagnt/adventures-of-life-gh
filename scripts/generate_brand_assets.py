from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = ROOT / "assets"
LOGO_PATH = ROOT / "adventuresoflifelogo.jpg"


@dataclass(frozen=True)
class BrandPalette:
    sky: tuple[int, int, int] = (232, 251, 255)
    sea: tuple[int, int, int] = (102, 213, 217)
    lagoon: tuple[int, int, int] = (47, 181, 205)
    canopy: tuple[int, int, int] = (70, 168, 98)
    sand: tuple[int, int, int] = (244, 210, 138)
    clay: tuple[int, int, int] = (214, 119, 51)
    ink: tuple[int, int, int] = (11, 34, 36)


PALETTE = BrandPalette()


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def lerp_rgb(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        int(round(lerp(a[0], b[0], t))),
        int(round(lerp(a[1], b[1], t))),
        int(round(lerp(a[2], b[2], t))),
    )


def vertical_gradient(size: tuple[int, int], stops: list[tuple[float, tuple[int, int, int]]]) -> Image.Image:
    w, h = size
    base = Image.new("RGB", size, (255, 255, 255))
    px = base.load()
    for y in range(h):
        t = y / max(1, h - 1)
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1:
                local = 0.0 if p1 == p0 else (t - p0) / (p1 - p0)
                color = lerp_rgb(c0, c1, local)
                for x in range(w):
                    px[x, y] = color
                break
    return base


def add_radial_glow(img: Image.Image, center: tuple[float, float], radius: float, color: tuple[int, int, int], alpha: float) -> Image.Image:
    w, h = img.size
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    cx, cy = center
    r = radius
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, int(255 * alpha)))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(2, int(radius * 0.12))))
    return Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")


def add_weave_lines(img: Image.Image, angle_deg: float, spacing: int, color: tuple[int, int, int], alpha: int) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    angle = math.radians(angle_deg)
    dx = math.cos(angle)
    dy = math.sin(angle)

    perp_dx = -dy
    perp_dy = dx
    steps = int((w + h) / spacing) + 4
    length = int(math.hypot(w, h) * 1.6)
    cx, cy = w / 2, h / 2

    for i in range(-steps, steps + 1):
        ox = cx + i * spacing * perp_dx
        oy = cy + i * spacing * perp_dy
        x0 = ox - length * dx
        y0 = oy - length * dy
        x1 = ox + length * dx
        y1 = oy + length * dy
        draw.line((x0, y0, x1, y1), fill=(*color, alpha), width=1)

    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.6))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def soft_noise(size: tuple[int, int], intensity: float = 0.06) -> Image.Image:
    noise = Image.effect_noise(size, 14).convert("L")
    noise = ImageEnhance.Contrast(noise).enhance(1.4)
    noise = ImageEnhance.Brightness(noise).enhance(1.05)
    noise = noise.filter(ImageFilter.GaussianBlur(radius=0.35))
    noise_rgba = Image.merge("RGBA", (noise, noise, noise, noise.point(lambda p: int(p * intensity))))
    return noise_rgba


def composite_logo_badge(canvas: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    if not LOGO_PATH.exists():
        raise FileNotFoundError(f"Logo not found at {LOGO_PATH}")

    x0, y0, x1, y1 = box
    bw = x1 - x0
    bh = y1 - y0
    badge = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(badge)

    disc_margin = int(min(bw, bh) * 0.08)
    disc_box = (disc_margin, disc_margin, bw - disc_margin, bh - disc_margin)
    draw.ellipse(disc_box, fill=(255, 255, 255, 235))

    ring = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring)
    ring_outer = disc_box
    ring_inner_margin = disc_margin + int(min(bw, bh) * 0.06)
    ring_inner = (ring_inner_margin, ring_inner_margin, bw - ring_inner_margin, bh - ring_inner_margin)

    ring_steps = 28
    for i in range(ring_steps):
        t = i / max(1, ring_steps - 1)
        col = lerp_rgb(PALETTE.sand, PALETTE.lagoon, t)
        alpha = int(155 * (0.35 + 0.65 * math.sin(math.pi * t)))
        inset = int(t * 4)
        box_outer = (ring_outer[0] + inset, ring_outer[1] + inset, ring_outer[2] - inset, ring_outer[3] - inset)
        ring_draw.ellipse(box_outer, outline=(*col, alpha), width=3)

    ring_mask = Image.new("L", (bw, bh), 0)
    mask_draw = ImageDraw.Draw(ring_mask)
    mask_draw.ellipse(ring_outer, fill=255)
    mask_draw.ellipse(ring_inner, fill=0)
    ring.putalpha(ring_mask)
    ring = ring.filter(ImageFilter.GaussianBlur(radius=0.6))
    badge = Image.alpha_composite(badge, ring)

    logo = Image.open(LOGO_PATH).convert("RGBA")
    pad = int(min(bw, bh) * 0.22)
    target_w = bw - pad * 2
    target_h = bh - pad * 2
    logo.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
    lx = (bw - logo.size[0]) // 2
    ly = (bh - logo.size[1]) // 2

    shadow = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    shadow.paste(logo, (lx, ly), logo)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=6))
    shadow = ImageEnhance.Brightness(shadow).enhance(0.25)
    badge = Image.alpha_composite(badge, shadow)
    badge.paste(logo, (lx, ly), logo)

    out = canvas.convert("RGBA")
    out.paste(badge, (x0, y0), badge)
    return out.convert("RGB")


def make_canvas(size: tuple[int, int]) -> Image.Image:
    w, h = size
    base = vertical_gradient(
        size,
        [
            (0.0, PALETTE.sky),
            (0.35, (200, 242, 255)),
            (0.55, PALETTE.sea),
            (0.78, PALETTE.sand),
            (1.0, (255, 246, 230)),
        ],
    )

    base = add_radial_glow(base, (w * 0.18, h * 0.2), radius=min(w, h) * 0.38, color=(255, 255, 255), alpha=0.62)
    base = add_radial_glow(base, (w * 0.84, h * 0.18), radius=min(w, h) * 0.34, color=PALETTE.lagoon, alpha=0.32)
    base = add_radial_glow(base, (w * 0.2, h * 0.84), radius=min(w, h) * 0.42, color=PALETTE.sand, alpha=0.44)
    base = add_radial_glow(base, (w * 0.78, h * 0.68), radius=min(w, h) * 0.36, color=PALETTE.canopy, alpha=0.22)

    base = add_weave_lines(base, angle_deg=135, spacing=max(14, int(min(w, h) * 0.05)), color=PALETTE.ink, alpha=10)
    base = add_weave_lines(base, angle_deg=45, spacing=max(18, int(min(w, h) * 0.06)), color=(255, 255, 255), alpha=26)

    noise = soft_noise(size, intensity=0.06)
    base_rgba = base.convert("RGBA")
    base_rgba = Image.alpha_composite(base_rgba, noise)
    return base_rgba.convert("RGB")


def export_icons() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    for size in (192, 512):
        canvas = make_canvas((size, size))
        badge_size = int(size * 0.72)
        margin = (size - badge_size) // 2
        canvas = composite_logo_badge(canvas, (margin, margin, margin + badge_size, margin + badge_size))
        canvas.save(ASSETS_DIR / f"icon-{size}.png", format="PNG", optimize=True)

    canvas = make_canvas((180, 180))
    badge_size = int(180 * 0.74)
    margin = (180 - badge_size) // 2
    canvas = composite_logo_badge(canvas, (margin, margin, margin + badge_size, margin + badge_size))
    canvas.save(ASSETS_DIR / "apple-touch-icon.png", format="PNG", optimize=True)

    icon_base = make_canvas((256, 256))
    badge_size = int(256 * 0.74)
    margin = (256 - badge_size) // 2
    icon_base = composite_logo_badge(icon_base, (margin, margin, margin + badge_size, margin + badge_size))
    icon_base.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def export_og() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    canvas = make_canvas((1200, 630))
    canvas = composite_logo_badge(canvas, (88, 118, 88 + 360, 118 + 360))

    canvas_rgba = canvas.convert("RGBA")
    draw = ImageDraw.Draw(canvas_rgba)
    try:
        title_font = ImageFont.truetype("arial.ttf", 64)
        sub_font = ImageFont.truetype("arial.ttf", 34)
    except OSError:
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()

    title = "Adventures of Life GH"
    subtitle = "Trips across Ghana and West Africa"

    x = 500
    y = 220
    draw.text((x + 2, y + 4), title, font=title_font, fill=(0, 0, 0, 70))
    draw.text((x, y), title, font=title_font, fill=(*PALETTE.ink, 235))

    sy = y + 86
    draw.text((x + 2, sy + 3), subtitle, font=sub_font, fill=(0, 0, 0, 58))
    draw.text((x, sy), subtitle, font=sub_font, fill=(*PALETTE.ink, 205))

    underline_y = sy + 58
    draw.rounded_rectangle((x, underline_y, x + 380, underline_y + 10), radius=999, fill=(232, 178, 74, 185))
    draw.rounded_rectangle((x + 190, underline_y, x + 580, underline_y + 10), radius=999, fill=(47, 181, 205, 140))

    out = canvas_rgba.convert("RGB")
    out.save(ASSETS_DIR / "og.jpg", format="JPEG", quality=90, optimize=True, progressive=True)


def main() -> None:
    export_icons()
    export_og()
    print("Generated brand assets.")


if __name__ == "__main__":
    main()