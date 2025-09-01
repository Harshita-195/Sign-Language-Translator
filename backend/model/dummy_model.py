import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

# Load trained model once
model = tf.keras.models.load_model("sign_model.h5")

# Labels must match your training classes
classes = ["Hello", "Thanks", "Yes", "No", "I Love You"]

mp_hands = mp.solutions.hands

def predict_gesture(frame):
    # Convert BGR (OpenCV) to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Use context manager so Hands object is created/destroyed properly
    with mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as hands:
        results = hands.process(image)

        if results.multi_hand_landmarks:
            # Take first hand
            hand_landmarks = results.multi_hand_landmarks[0]

            # Extract normalized landmark coordinates
            coords = []
            for lm in hand_landmarks.landmark:
                coords.extend([lm.x, lm.y, lm.z])

            # Convert to numpy array
            coords = np.array(coords).reshape(1, -1)

            # Predict gesture
            preds = model.predict(coords)
            class_idx = np.argmax(preds[0])
            return classes[class_idx]
        else:
            return "No hands detected"
