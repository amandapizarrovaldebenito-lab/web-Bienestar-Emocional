from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
src = root / "tmp" / "pdf-review"
out = root / "assets" / "images"
out.mkdir(parents=True, exist_ok=True)

crops = {
    "brand-logo.jpg": ("PAGINA_INICIO.png", (18, 12, 160, 68)),
    "hero-home.jpg": ("PAGINA_INICIO.png", (440, 80, 940, 385)),
    "hero-about.jpg": ("PAGINA_NOSOTRAS.png", (465, 82, 935, 390)),
    "hero-contact.jpg": ("PAGINA_CONTACTO.png", (485, 85, 945, 395)),
    "hero-experience.jpg": ("PAGINA_DE_EXPERIENCIAS.png", (455, 90, 910, 390)),
    "journey-present.jpg": ("PAGINA_INICIO.png", (30, 718, 300, 858)),
    "journey-wellbeing.jpg": ("PAGINA_INICIO.png", (335, 718, 605, 858)),
    "journey-habitar.jpg": ("PAGINA_INICIO.png", (640, 718, 915, 858)),
    "founder.jpg": ("PAGINA_NOSOTRAS.png", (28, 710, 196, 980)),
    "founder-2.jpg": ("PAGINA_NOSOTRAS.png", (500, 710, 670, 980)),
    "about-cta.jpg": ("PAGINA_NOSOTRAS.png", (475, 1835, 925, 2075)),
    "experience-1.jpg": ("PAGINA_INICIO.png", (15, 1658, 306, 1775)),
    "experience-2.jpg": ("PAGINA_INICIO.png", (324, 1658, 615, 1775)),
    "experience-3.jpg": ("PAGINA_INICIO.png", (634, 1658, 925, 1775)),
}

for name, (source, box) in crops.items():
    im = Image.open(src / source).convert("RGB")
    box = (max(0, box[0]), max(0, box[1]), min(im.width, box[2]), min(im.height, box[3]))
    im.crop(box).save(out / name, quality=90, optimize=True)
