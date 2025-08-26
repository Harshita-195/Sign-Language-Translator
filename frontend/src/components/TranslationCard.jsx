import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TranslationCard({ title, text, onSpeak }) {
  return (
    <motion.div
      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-start justify-between gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <p className="text-sm opacity-70 mb-1">{title}</p>
        <p className="text-xl font-semibold">{text || '—'}</p>
      </div>
      <button
        onClick={onSpeak}
        disabled={!text}
        className="self-start p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 disabled:opacity-40"
        title="Speak"
      >
        <Volume2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
