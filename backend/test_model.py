import tensorflow as tf
import numpy as np
from pathlib import Path
from tensorflow.keras.preprocessing import image
import random
import matplotlib.pyplot as plt

# ---------------------------
# Load trained model
# ---------------------------
MODEL_PATH = "sign_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded:", MODEL_PATH)

# Get input size from model dynamically
input_shape = model.input_shape[1:3]  # Example: (128,128)
print("✅ Model input size:", input_shape)

# ---------------------------
# Load class names
# ---------------------------
train_dir = Path("data/split_dataset/train")
class_names = sorted([c.name for c in train_dir.glob("*") if c.is_dir()])
if not class_names:
    raise ValueError("❌ No class folders found in 'data/split_dataset/train/'")
print("✅ Classes loaded:", class_names[:10], "...")

# ---------------------------
# Pick a random test image
# ---------------------------
test_dir = Path("data/split_dataset/test")
all_images = list(test_dir.glob("*/*.jpg")) + list(test_dir.glob("*/*.png"))

if not all_images:
    raise FileNotFoundError("❌ No test images found in 'data/split_dataset/test/'. Please check dataset path.")

img_path = random.choice(all_images)
print("🖼️ Testing with image:", img_path)

# ---------------------------
# Preprocess image
# ---------------------------
img = image.load_img(img_path, target_size=input_shape)
img_array = image.img_to_array(img)

# ⚠️ IMPORTANT: normalize only if your model does NOT have Rescaling(1./255)
# If you already added Rescaling in training, REMOVE the division below.
img_array = img_array / 255.0  

img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

# ---------------------------
# Predict
# ---------------------------
predictions = model.predict(img_array)
pred_class_idx = np.argmax(predictions, axis=1)[0]
predicted_class = class_names[pred_class_idx]
confidence = float(np.max(predictions))

print(f"🔮 Predicted: {predicted_class} (confidence: {confidence:.2f})")

# ---------------------------
# Show image with prediction
# ---------------------------
plt.imshow(image.load_img(img_path))
plt.axis("off")
plt.title(f"Predicted: {predicted_class}\nConfidence: {confidence:.2f}")
plt.show()
