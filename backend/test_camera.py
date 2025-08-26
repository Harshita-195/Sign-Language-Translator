import cv2
import mediapipe as mp
import requests

# Flask API endpoint
API_URL = "http://127.0.0.1:5000/translate"

# Initialize MediaPipe Hands and Drawing utils
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Open webcam
cap = cv2.VideoCapture(0)

with mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as hands:

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Could not grab frame from webcam")
            break

        # Convert to RGB for mediapipe
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        # Draw landmarks if detected
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Encode frame to JPEG for backend
        success, buffer = cv2.imencode(".jpg", frame)
        if not success:
            continue

        files = {"frame": ("frame.jpg", buffer.tobytes(), "image/jpeg")}

        try:
            response = requests.post(API_URL, files=files)
            if response.status_code == 200:
                prediction = response.json().get("translation", "")
                cv2.putText(frame, f"Prediction: {prediction}", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                cv2.putText(frame, "API Error", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        except Exception as e:
            cv2.putText(frame, "Connection Error", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Show the frame
        cv2.imshow("Hand Tracking + API", frame)

        # Exit on 'q'
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

cap.release()
cv2.destroyAllWindows()
