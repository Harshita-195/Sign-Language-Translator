import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Volume2 } from 'lucide-react';
import clsx from 'clsx';

export default function HistoryPanel({ items, favorites, onClose, onToggleFav, onSpeak }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/40 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="ml-auto h-full w-full max-w-xl bg-white dark:bg-gray-900 p-4 overflow-y-auto"
        initial={{ x: 40 }}
        animate={{ x: 0 }}
        exit={{ x: 40 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">History</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X /></button>
        </div>

        <ul className="mt-4 space-y-2">
          {items.length === 0 && <p className="text-sm opacity-70">Nothing here yet.</p>}
          {items.map((h) => (
            <li key={h.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm"><span className="font-medium">EN:</span> {h.source}</p>
                  <p className="text-sm opacity-80"><span className="font-medium">→ {h.lang.toUpperCase()}:</span> {h.translated}</p>
                  <p className="text-[10px] opacity-60 mt-1">{new Date(h.ts).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={()=>onSpeak(h.translated)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Speak">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    className={clsx('p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800', favorites.has(h.id) && 'text-yellow-500')}
                    onClick={() => onToggleFav(h.id)}
                    title="Favorite"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
