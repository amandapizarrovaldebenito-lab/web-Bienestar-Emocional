from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
files = sorted((root / "assets" / "images" / "extracted").glob("*.png"))
thumb_w, thumb_h, label_h, cols = 240, 150, 42, 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "white")
draw = ImageDraw.Draw(sheet)
for index, file in enumerate(files):
    image = Image.open(file).convert("RGB")
    image.thumbnail((thumb_w - 12, thumb_h - 12))
    x = (index % cols) * thumb_w
    y = (index // cols) * (thumb_h + label_h)
    sheet.paste(image, (x + (thumb_w - image.width) // 2, y + (thumb_h - image.height) // 2))
    draw.text((x + 5, y + thumb_h + 3), file.name[:37], fill="#111827")
sheet.save(root / "tmp" / "asset-sheet.jpg", quality=88)
