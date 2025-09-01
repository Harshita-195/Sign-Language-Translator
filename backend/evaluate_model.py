# backend/evaluate_model.py
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

# ----------------------
# 1. Load model
# ----------------------
model = tf.keras.models.load_model("sign_model.h5")

# ----------------------
# 2. Load test dataset
# ----------------------
img_size = (128, 128)
batch_size = 32

test_ds = tf.keras.utils.image_dataset_from_directory(
    "data/split_dataset/test",
    image_size=img_size,
    batch_size=batch_size,
    shuffle=False
)

class_names = test_ds.class_names
print(f"✅ Found {len(class_names)} classes: {class_names}")

# ----------------------
# 3. Get predictions
# ----------------------
y_true = []
y_pred = []

for images, labels in test_ds:
    preds = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(preds, axis=1))

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# ----------------------
# 4. Accuracy & Report
# ----------------------
print("\n📊 Classification Report:\n")
print(classification_report(y_true, y_pred, target_names=class_names))

# ----------------------
# 5. Confusion Matrix
# ----------------------
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=class_names, yticklabels=class_names)
plt.xlabel("Predicted")
plt.ylabel("True")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()
