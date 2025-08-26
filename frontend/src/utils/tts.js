let voicesCache = [];

export function getVoicesOnce() {
  // browsers populate voices asynchronously
  function load() {
    voicesCache = window.speechSynthesis?.getVoices?.() || [];
  }
  load();
  if (typeof window !== 'undefined') {
    window.speechSynthesis?.addEventListener?.('voiceschanged', load, { once: true });
  }
}

export function listVoices() {
  return (voicesCache.length ? voicesCache : (window.speechSynthesis?.getVoices?.() || []));
}

export function speak({ text, rate = 1, voiceName = '' }) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  const vs = listVoices();
  const voice = vs.find(v => v.name === voiceName);
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
