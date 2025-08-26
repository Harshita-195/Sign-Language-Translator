import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const API_URL = "http://127.0.0.1:5000/translate";

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("");

  // Capture frame and send to backend
  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      // Convert base64 -> blob
      const blob = await fetch(imageSrc).then(res => res.blob());

      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setPrediction(data.translation || "No gesture");
        } else {
          setPrediction("API Error");
        }
      } catch (err) {
        console.error("Error sending frame:", err);
        setPrediction("Connection error");
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-2xl shadow-lg"
        width={400}
      />

      <button
        onClick={capture}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Capture & Translate
      </button>

      <p className="text-xl font-semibold text-gray-800">
        {prediction ? `Prediction: ${prediction}` : "No prediction yet"}
      </p>
    </div>
  );
}
