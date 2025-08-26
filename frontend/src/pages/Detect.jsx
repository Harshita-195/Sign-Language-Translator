import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Languages,
  Camera,
  History as HistoryIcon,
  Star,
  Settings as SettingsIcon,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";

import WebcamTranslator from "../components/WebcamTranslator.jsx";
import TranslationCard from "../components/TranslationCard.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import LearnPanel from "../components/LearnPanel.jsx";

import { speak, getVoicesOnce } from "../utils/tts.js";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "mr", label: "Marathi" },
];

const LS_KEYS = {
  THEME: "st.theme",
  HISTORY: "st.history",
  FAVORITES: "st.favorites",
  SETTINGS: "st.settings",
};

export default function Detect() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(LS_KEYS.THEME) || "light"
  );
  const [targetLang, setTargetLang] = useState("en");
  const [recognized, setRecognized] = useState("");
  const [translated, setTranslated] = useState("");
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) || "[]")
  );
  const [favorites, setFavorites] = useState(
    () =>
      new Set(
        JSON.parse(localStorage.getItem(LS_KEYS.FAVORITES) || "[]")
      )
  );
  const [showHistory, setShowHistory] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const s = JSON.parse(localStorage.getItem(LS_KEYS.SETTINGS) || "{}");
    return { ttsRate: s.ttsRate ?? 1, voiceName: s.voiceName ?? "" };
  });

  // Theme persistence
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(LS_KEYS.THEME, theme);
  }, [theme]);

  // Persist history, favorites, settings
  useEffect(() => {
    localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      LS_KEYS.FAVORITES,
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    getVoicesOnce(); // preload voices
  }, []);

  const onRecognized = (data) => {
    const { recognized = "", translated = "" } = data;
    setRecognized(recognized);
    setTranslated(translated);

    if (recognized) {
      const record = {
        id: crypto.randomUUID(),
        ts: Date.now(),
        source: recognized,
        translated,
        lang: targetLang,
      };
      setHistory((h) => [record, ...h].slice(0, 100));
    }
  };

  const speakOut = (text) => {
    if (!text) return;
    speak({ text, rate: settings.ttsRate, voiceName: settings.voiceName });
  };

  const toggleFav = (itemId) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(itemId) ? n.delete(itemId) : n.add(itemId);
      return n;
    });
  };

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sign-translations-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-gray-900/60 border-b border-gray-200/70 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-2">
          <Camera className="w-6 h-6" />
          <h1 className="text-lg sm:text-2xl font-semibold">Sign Translator</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowLearn((s) => !s)}
              title="Learning mode"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowHistory(true)}
              title="History"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>

            <div className="relative">
              <select
                className="appearance-none bg-gray-100 dark:bg-gray-800 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                title="Target language"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Languages className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            <button
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl p-4 grid gap-4 lg:grid-cols-2">
        <section className="space-y-4">
          <WebcamTranslator onRecognized={onRecognized} targetLang={targetLang} />
        </section>

        <section className="space-y-4">
          {/* Result Card */}
          <motion.div
            className="rounded-2xl bg-white/80 dark:bg-gray-800/70 shadow-soft p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-2">Result</h2>
            <div className="grid gap-3">
              <TranslationCard
                title="Recognized (EN)"
                text={recognized}
                onSpeak={() => speakOut(recognized)}
              />
              <TranslationCard
                title={`Translated (${
                  LANGS.find((l) => l.code === targetLang)?.label
                })`}
                text={translated}
                onSpeak={() => speakOut(translated)}
              />
            </div>
          </motion.div>

          {/* Recent History */}
          <motion.div
            className="rounded-2xl bg-white/80 dark:bg-gray-800/70 shadow-soft p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent</h2>
              <div className="flex gap-2">
                <button
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={exportHistory}
                >
                  Export
                </button>
                <button
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setHistory([])}
                >
                  Clear
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {history.slice(0, 6).map((h) => (
                <li
                  key={h.id}
                  className="flex items-start justify-between rounded-xl p-3 bg-gray-50 dark:bg-gray-900"
                >
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">EN:</span> {h.source}
                    </p>
                    <p className="text-sm opacity-80">
                      <span className="font-medium">
                        → {h.lang.toUpperCase()}:
                      </span>{" "}
                      {h.translated}
                    </p>
                  </div>
                  <button
                    className={clsx(
                      "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                      favorites.has(h.id) && "text-yellow-500"
                    )}
                    onClick={() => toggleFav(h.id)}
                    title="Favorite"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                </li>
              ))}
              {history.length === 0 && (
                <p className="text-sm opacity-70">
                  No items yet—start the webcam and translate.
                </p>
              )}
            </ul>
          </motion.div>
        </section>
      </main>

      {/* Drawers / Modals */}
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            items={history}
            favorites={favorites}
            onClose={() => setShowHistory(false)}
            onToggleFav={toggleFav}
            onSpeak={(t) => speakOut(t)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal
            settings={settings}
            setSettings={setSettings}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLearn && <LearnPanel onClose={() => setShowLearn(false)} />}
      </AnimatePresence>

      <footer className="py-8 text-center text-xs opacity-70">
        Built with ❤️ using React + Tailwind + Framer Motion
      </footer>
    </div>
  );
}
