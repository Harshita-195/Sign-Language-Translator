import os

DATASET_PATH = "data/phrases_dataset"

# List all classes (words)
classes = os.listdir(DATASET_PATH)
print(f"✅ Found {len(classes)} classes/words")
print("📂 Example classes:", classes[:10])  # first 10 words

# Count images in each class
for cls in classes[:5]:  # check first 5
    cls_path = os.path.join(DATASET_PATH, cls)
    images = os.listdir(cls_path)
    print(f"{cls}: {len(images)} images")
