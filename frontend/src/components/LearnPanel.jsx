import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const CARDS = [
  { word: 'Hello', tip: 'Open palm wave' },
  { word: 'Thank you', tip: 'Fingers from chin outward' },
  { word: 'Yes', tip: 'Fist nodding' },
  { word: 'No', tip: 'Index + middle finger tap' },
  { word: 'Please', tip: 'Flat palm circle on chest' },
];

export default function LearnPanel({ onClose }) {
  const [idx, setIdx] = useState(0);
  const card = CARDS[idx % CARDS.length];

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-5"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Learning Mode</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X /></button>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-semibold mb-1">{card.word}</p>
          <p className="text-sm opacity-70">{card.tip}</p>
          <div className="mt-4">
            <button onClick={()=>setIdx(i=>i+1)} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Next</button>
          </div>
        </div>

        <p className="text-xs opacity-70 mt-3">These are simple hints for practice; exact forms vary by sign language.</p>
      </motion.div>
    </motion.div>
  );
}
