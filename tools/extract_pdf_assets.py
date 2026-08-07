from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
out = root / "assets" / "images" / "extracted"
out.mkdir(parents=True, exist_ok=True)

for pdf in sorted((root / "Maquetas").glob("*.pdf")):
    reader = PdfReader(pdf)
    stem = "-".join(pdf.stem.lower().replace("_", " ").split())
    for page_number, page in enumerate(reader.pages, 1):
        for image_number, image in enumerate(page.images, 1):
            if len(image.data) < 20_000:
                continue
            suffix = Path(image.name).suffix or ".bin"
            target = out / f"{stem}-p{page_number}-{image_number}{suffix}"
            target.write_bytes(image.data)
            print(target.relative_to(root), len(image.data))
