# SignLanguageTranslator (Fixed)

Clean, runnable starter with:
- Flask backend (expects `frame` image; safe fallback if none sent)
- React frontend (webcam + auto capture every 3s)
- Optional Node API gateway (proxy) — not required for local demo

## Prereqs
- Python 3.10+
- Node.js 18+

## Run Backend
```powershell
cd backend
pip install -r requirements.txt
python app.py
```
Serves: http://127.0.0.1:5000

## Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
Opens: http://localhost:5173

Allow camera permission in the browser. The page captures a frame every 3 seconds and sends it to `/translate`.

## Optional: Run API Gateway
```powershell
cd server
npm install
npm start
```
Then you can POST a file to `http://localhost:4000/api/translate` (key: `frame`).

## Notes
- If installing `opencv-python` is heavy on Windows, try `pip install opencv-python-headless` and remove the full package.
