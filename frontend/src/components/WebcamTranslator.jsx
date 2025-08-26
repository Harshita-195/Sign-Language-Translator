import React, { useRef, useEffect } from "react";

export default function WebcamTranslator({ onRecognized, targetLang }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start webcam stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("✅ Webcam started");
        }
      })
      .catch(err => {
        console.error("❌ Error accessing webcam:", err);
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

      console.log("📤 Sending frame to backend...");

      try {
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        const res = await fetch(`http://localhost:5000/translate?lang=${targetLang}`, {
          method: "POST",
          body: formData,
        });

        console.log("✅ Response status:", res.status);

        if (!res.ok) {
          const errText = await res.text();
          console.error("❌ Backend returned error:", errText);
          return;
        }

        const data = await res.json();
        console.log("📥 Backend response:", data);

        if (onRecognized) {
          onRecognized({
            recognized: data.recognized || "",
            translated: data.translated || ""
          });
        }
      } catch (err) {
        console.error("⚠️ Error sending frame:", err);
      }
    }, "image/jpeg");
  };

  // Capture every 2 seconds
  useEffect(() => {
    const interval = setInterval(captureAndSend, 2000);
    return () => clearInterval(interval);
  }, [targetLang]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-md"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
