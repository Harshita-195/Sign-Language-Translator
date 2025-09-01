from pathlib import Path
import shutil
import random

# Paths
SRC_DIR = Path("data/phrases_dataset")   # source folder with 44 classes
DEST_DIR = Path("data/split_dataset")    # where train/val/test will be created

# Split ratios
TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15

def split_class(class_dir: Path, dest_dir: Path):
    """Split images from one class into train/val/test."""
    images = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.png")) + list(class_dir.glob("*.jpeg"))
    random.shuffle(images)

    n_total = len(images)
    n_train = int(n_total * TRAIN_RATIO)
    n_val = int(n_total * VAL_RATIO)

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train+n_val],
        "test": images[n_train+n_val:]
    }

    for split, imgs in splits.items():
        split_dir = dest_dir / split / class_dir.name
        split_dir.mkdir(parents=True, exist_ok=True)
        for img in imgs:
            shutil.copy(img, split_dir / img.name)

def main():
    assert SRC_DIR.exists(), f"Source not found: {SRC_DIR}"
    if DEST_DIR.exists():
        shutil.rmtree(DEST_DIR)
    DEST_DIR.mkdir(parents=True, exist_ok=True)

    classes = [c for c in SRC_DIR.iterdir() if c.is_dir()]
    print(f"✅ Found {len(classes)} classes")

    for class_dir in classes:
        print(f"📂 Splitting {class_dir.name} ...")
        split_class(class_dir, DEST_DIR)

    print("✅ Dataset split completed!")

if __name__ == "__main__":
    main()
