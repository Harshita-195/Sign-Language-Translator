from pathlib import Path

BASE_DIR = Path("data/split_dataset")

for split in ["train", "val", "test"]:
    split_dir = BASE_DIR / split
    if not split_dir.exists():
        print(f"{split}: folder not found")
        continue

    total = 0
    for c in split_dir.iterdir():
        if c.is_dir():
            total += sum(1 for p in c.glob("*") if p.is_file())
    print(f"{split}: {total} images")
