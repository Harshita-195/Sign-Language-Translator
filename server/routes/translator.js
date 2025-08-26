import express from "express";
import axios from "axios";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Accept a file named 'frame' and forward to Python backend
router.post("/translate", upload.single("frame"), async (req, res) => {
    try {
        // If no file provided, call backend without a file (it will fallback to Hello 👋)
        if (!req.file) {
            const { data, status } = await axios.post("http://127.0.0.1:5000/translate");
            return res.status(status).json(data);
        }
        // Forward the file to backend
        const formData = new FormData();
        formData.append("frame", new Blob([req.file.buffer]), "frame.png");
        const resp = await fetch("http://127.0.0.1:5000/translate", { method: "POST", body: formData });
        const data = await resp.json();
        res.status(resp.status).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Translation failed" });
    }
});

export default router;
