from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import logging
from werkzeug.exceptions import RequestEntityTooLarge
import tensorflow as tf
from pathlib import Path

# ---------------------------
# App setup
# ---------------------------
app = Flask(__name__)
CORS(app)  # Allow all origins for dev

# Limit file upload size (5 MB max)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# ---------------------------
# Load trained model
# ---------------------------
MODEL_PATH = "sign_model.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    logger.info(f"✅ Loaded model from {MODEL_PATH}")
    INPUT_SIZE = model.input_shape[1:3]  # (128,128)
    logger.info(f"✅ Model input size: {INPUT_SIZE}")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    model = None
    INPUT_SIZE = (128, 128)

# Load gesture class names dynamically from dataset folder
DATASET_DIR = Path("data/split_dataset/train")
if DATASET_DIR.exists():
    CLASS_NAMES = sorted([c.name for c in DATASET_DIR.glob("*") if c.is_dir()])
    logger.info(f"✅ Loaded {len(CLASS_NAMES)} classes from dataset")
else:
    # fallback example
    CLASS_NAMES = ["Hello", "Thanks", "Yes", "No", "Goodbye"]
    logger.warning("⚠️ Dataset folder not found. Using fallback class names.")

# Confidence threshold
THRESHOLD = 0.8


# ---------------------------
# Prediction function
# ---------------------------
def predict_gesture(frame):
    """Run gesture recognition using trained image model"""
    if model is None:
        return "Model not loaded"

    # Resize to match training input
    img = cv2.resize(frame, INPUT_SIZE)   # e.g., (128,128)
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)

    # Predict
    prediction = model.predict(img)[0]
    confidence = np.max(prediction)
    predicted_class = np.argmax(prediction)

    if confidence < THRESHOLD:
        return "No sign detected"

    return CLASS_NAMES[predicted_class]



# ---------------------------
# Error handlers
# ---------------------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(RequestEntityTooLarge)
def file_too_large(e):
    return jsonify({"error": "File too large. Max size is 5 MB."}), 413


# ---------------------------
# Routes
# ---------------------------
@app.route("/ping", methods=["GET"])
def ping():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200


@app.route("/translate", methods=["POST"])
def translate():
    try:
        file = request.files["frame"]
        npimg = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid frame received"}), 400

        # Predict gesture
        gesture = predict_gesture(frame)

        return jsonify({"prediction": gesture})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Main entry
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
