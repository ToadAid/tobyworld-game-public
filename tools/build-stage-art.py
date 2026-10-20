from pathlib import Path

from PIL import Image


ASSET_DIRECTORY = Path("assets")
OUTPUT_DIRECTORY = ASSET_DIRECTORY / "stage-art"
STAGE_IDS = (
    "0715",
    "0716",
    "0717",
    "0718",
    "0340",
    "0378",
    "0118",
    "0182",
    "0887",
    "1091",
    "0969",
    "0094",
)
MOBILE_SIZE = 768


def save_webp(image: Image.Image, output_path: Path, quality: int) -> None:
    image.save(output_path, "WEBP", quality=quality, method=6)


def build_stage_art(stage_id: str) -> None:
    source_path = ASSET_DIRECTORY / f"imagined-{stage_id}.png"
    with Image.open(source_path) as source:
        image = source.convert("RGBA" if source.has_transparency_data else "RGB")
        save_webp(image, OUTPUT_DIRECTORY / f"imagined-{stage_id}.webp", quality=84)

        mobile = image.copy()
        mobile.thumbnail((MOBILE_SIZE, MOBILE_SIZE), Image.Resampling.LANCZOS)
        save_webp(mobile, OUTPUT_DIRECTORY / f"imagined-{stage_id}-768.webp", quality=78)


OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
for deed_id in STAGE_IDS:
    build_stage_art(deed_id)

print(f"Wrote {len(STAGE_IDS) * 2} optimized stage-art files to {OUTPUT_DIRECTORY}")
