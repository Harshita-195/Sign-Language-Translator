import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import React from "react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">🤟 Sign Translator</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/detect" className="hover:underline">Detect</Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detect />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
          © {new Date().getFullYear()} Sign Translator. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}
