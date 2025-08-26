from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import logging
from werkzeug.exceptions import RequestEntityTooLarge
from model.dummy_model import predict_gesture

# ---------------------------
# App setup
# ---------------------------
app = Flask(__name__)

# Limit file upload size (5 MB max)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  

# Allow frontend (adjust if deployed)
CORS(app, resources={r"/translate": {"origins": "*"}})

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


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
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


@app.route("/translate", methods=["POST"])
def translate():
    try:
        if "frame" not in request.files:
            logger.warning("No frame found in request")
            return jsonify({"error": "No frame uploaded"}), 400

        file = request.files["frame"]
        npimg = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            logger.error("Failed to decode image")
            return jsonify({"error": "Invalid image data"}), 400

        # Run gesture prediction
        prediction = predict_gesture(frame)
        logger.info(f"Prediction: {prediction}")

        return jsonify({"translation": prediction}), 200

    except Exception as e:
        logger.exception("Error during /translate request")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


# ---------------------------
# Main entry point
# ---------------------------
if __name__ == "__main__":
    # Debug only for local dev
    app.run(host="0.0.0.0", port=5000, debug=True)
