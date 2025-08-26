import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { listVoices } from '../utils/tts.js';

export default function SettingsModal({ settings, setSettings, onClose }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    setVoices(listVoices());
    const id = setInterval(() => setVoices(listVoices()), 500);
    setTimeout(() => clearInterval(id), 1500);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-5"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Voice</label>
            <select
              value={settings.voiceName}
              onChange={(e)=>setSettings(s => ({...s, voiceName: e.target.value}))}
              className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            >
              <option value="">System default</option>
              {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">TTS Rate: {settings.ttsRate.toFixed(2)}x</label>
            <input
              type="range" min="0.5" max="1.5" step="0.05"
              value={settings.ttsRate}
              onChange={(e)=>setSettings(s => ({...s, ttsRate: parseFloat(e.target.value)}))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-5 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Done</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
