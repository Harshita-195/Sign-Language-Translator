import axios from 'axios';

// Change baseURL if your backend runs elsewhere:
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Send a base64 JPEG frame and get { text: 'Hello' }
export async function recognizeFrame(dataUrl) {
  const res = await api.post('/recognize', { image: dataUrl });
  return res.data;
}

// Translate: { text, target } -> { translated }
export async function translateText(text, target) {
  const res = await api.post('/translate', { text, target });
  return res.data;
}
