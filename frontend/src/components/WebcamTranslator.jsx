import React, { useRef, useEffect, useState } from "react";

export default function WebcamTranslator({ targetLang = "en" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognized, setRecognized] = useState("");
  const [translated, setTranslated] = useState("");
  const [status, setStatus] = useState("Initializing...");

  // Start webcam stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus("✅ Webcam started");
        }
      })
      .catch(err => {
        console.error("❌ Error accessing webcam:", err);
        setStatus("❌ Webcam access denied");
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture a frame & send to backend
  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.warn("⚠️ No frame captured");
        return;
      }

      setStatus("📤 Sending frame...");

      try {
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

        const res = await fetch(`http://localhost:5000/translate?lang=${targetLang}`, {
          method: "POST",
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errText = await res.text();
          console.error("❌ Backend error:", errText);
          setStatus("❌ Backend error");
          return;
        }

        const data = await res.json();
        console.log("📥 Response:", data);

        setRecognized(data.recognized || "");
        setTranslated(data.translated || "");
        setStatus("✅ Frame processed");
      } catch (err) {
        if (err.name === "AbortError") {
          setStatus("⚠️ Request timed out");
        } else {
          console.error("⚠️ Error:", err);
          setStatus("⚠️ Network error");
        }
      }
    }, "image/jpeg");
  };

  // Capture every 2 seconds
  useEffect(() => {
    const interval = setInterval(captureAndSend, 2000);
    return () => clearInterval(interval);
  }, [targetLang]);

  return (
    <div className="p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-md"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-gray-500 text-sm">{status}</p>

        <p className="text-lg font-semibold mt-2">🖐 Recognized:</p>
        <p className="text-blue-600">{recognized || "..."}</p>

        <p className="text-lg font-semibold mt-2">🌍 Translated:</p>
        <p className="text-green-600">{translated || "..."}</p>
      </div>
    </div>
  );
}
