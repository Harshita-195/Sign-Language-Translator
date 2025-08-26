import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands

def predict_gesture(frame):
    """
    Detects if a hand is present in the frame.
    Returns a simple text for now (later replace with trained classifier).
    """

    # Convert BGR (OpenCV) to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Use context manager so Hands object is created/destroyed properly
    with mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as hands:

        results = hands.process(image)

        if results.multi_hand_landmarks:
            num_hands = len(results.multi_hand_landmarks)
            return f"Detected {num_hands} hand(s)"
        else:
            return "No hands detected"
