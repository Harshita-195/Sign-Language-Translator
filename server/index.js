import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/api/translate", upload.single("frame"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("frame", fs.createReadStream(req.file.path));

    const response = await axios.post("http://127.0.0.1:5000/translate", formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    fs.unlinkSync(req.file.path); // cleanup temp file
  }
});

app.listen(4000, () => console.log("Node proxy running on http://localhost:4000"));
