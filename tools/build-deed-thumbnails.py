from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import os

from PIL import Image


archive_value = os.environ.get("TOBYWORLD_CANONICAL_ARCHIVE")
if not archive_value:
    raise SystemExit(
        "Set TOBYWORLD_CANONICAL_ARCHIVE to a permission-cleared canonical archive "
        "before rebuilding deed thumbnails."
    )
archive_root = Path(archive_value)
source_directory = archive_root / "images"
output_directory = Path("assets/deed-thumbnails")
output_directory.mkdir(parents=True, exist_ok=True)
source_files = sorted(source_directory.glob("*.png"))
thumbnail_size = 512


def build_thumbnail(source_path: Path) -> None:
    output_path = output_directory / f"{source_path.stem}.webp"
    with Image.open(source_path) as source_image:
        image = source_image.convert("RGB")
        image.thumbnail((thumbnail_size, thumbnail_size), Image.Resampling.LANCZOS)
        image.save(output_path, "WEBP", quality=78, method=5)


with ThreadPoolExecutor(max_workers=min(8, os.cpu_count() or 1)) as executor:
    list(executor.map(build_thumbnail, source_files))

print(f"Wrote {len(source_files)} canonical deed visuals at {thumbnail_size}px to {output_directory}")
