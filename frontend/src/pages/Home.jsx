import React from "react";
import { Link } from "react-router-dom";
import { Camera, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Floating gradient circle */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl opacity-40 animate-pulse"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-indigo-400 to-purple-500 drop-shadow-lg">
          Sign Translator 🤟
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300">
          Breaking communication barriers with AI-powered real-time sign
          language translation.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <Link
            to="/detect"
            className="px-8 py-3 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
            shadow-lg hover:shadow-indigo-600/50 transition"
          >
            🚀 Start Detection
          </Link>
        </motion.div>
      </header>

      {/* Features */}
      <section className="py-20 relative">
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-300">
          ✨ Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              icon: <Camera className="w-14 h-14 text-indigo-400 mb-4" />,
              title: "Real-time Detection",
              desc: "Detects and translates sign language instantly using your webcam.",
            },
            {
              icon: <Globe className="w-14 h-14 text-purple-400 mb-4" />,
              title: "Multilingual Support",
              desc: "Expand communication across languages for inclusivity.",
            },
            {
              icon: <Zap className="w-14 h-14 text-pink-400 mb-4" />,
              title: "Fast & Lightweight",
              desc: "Optimized for performance with smooth user experience.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.05 }}
              className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 
              rounded-2xl shadow-lg border border-gray-700 hover:border-indigo-500 
              transition"
            >
              {feature.icon}
              <h3 className="font-bold text-xl text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 text-center px-6 bg-gradient-to-r from-[#1f1c2c] to-[#928DAB]">
        <h2 className="text-4xl font-bold mb-12 text-indigo-200">
          ⚡ How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { step: "✋", title: "Step 1", desc: "Show your hand gesture in front of the camera." },
            { step: "📷", title: "Step 2", desc: "AI detects and interprets the sign language." },
            { step: "📝", title: "Step 3", desc: "Translated text is displayed instantly." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-700"
            >
              <div className="text-4xl mb-3">{item.step}</div>
              <h3 className="font-semibold text-xl text-white">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-900 text-center px-6">
        <h2 className="text-4xl font-bold mb-6 text-indigo-300">
          🌍 Why It Matters
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed">
          Over <span className="font-bold text-indigo-400">70 million people</span> worldwide use sign
          language. This project reduces the communication gap and fosters inclusivity for people with
          hearing and speech impairments.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gradient-to-r from-gray-950 to-gray-900 text-center text-gray-500">
        Made with ❤️ by Our Team
      </footer>
    </div>
  );
}
